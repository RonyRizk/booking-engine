import { isRedirectError } from "next/dist/client/components/redirect";
import { isTestingEnvironment } from "@/lib/app-env";
import { errorLogger, printLogger } from "@/logger";

const REPEAT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REMEMBERED = 1000;
const MAX_VALUE_LENGTH = 64;
const MAX_URL_LENGTH = 2048; // long enough for a whole token
const MAX_ERROR_MESSAGE_LENGTH = 500;
const MAX_ERROR_STACK_LENGTH = 2000;
const LOGGED_FIELDS = ["route", "mode", "property", "booking", "agent", "document", "from", "to", "lang", "environment"];

// In memory and per process: a repeat limit, not an audit trail.
const remembered = new Map();

/** Forgets every outcome seen so far. */
export const forgetPrintRepeats = () => remembered.clear();

/** Calls `write` unless `key` was written within the window; repeats are counted for the next line. */
const writeUnlessRepeat = (key, write) => {
    const last = remembered.get(key);
    if (last && Date.now() - last.writtenAt < REPEAT_WINDOW_MS) {
        last.skipped += 1;
        return;
    }
    remembered.delete(key); // re-added last, so the first key is always the oldest
    remembered.set(key, { writtenAt: Date.now(), skipped: 0 });
    if (remembered.size > MAX_REMEMBERED) {
        remembered.delete(remembered.keys().next().value);
    }
    write(last?.skipped ? { skipped: last.skipped } : {});
};

// Named fields only, each cut to size: these come from the URL, which also carries the token.
const pickContext = (context) =>
    Object.fromEntries(LOGGED_FIELDS.filter((field) => context[field]).map((field) => [field, String(context[field]).slice(0, MAX_VALUE_LENGTH)]));

// Rebuilt from the page's props, token included: the one place a line carries it.
const printUrl = ({ params, searchParams }, route) => {
    const path = route === "booking" ? "printing" : `printing/${route}`;
    return `https://${params.domain}/${params.id}/${path}?${new URLSearchParams(searchParams)}`.slice(0, MAX_URL_LENGTH);
};

// Picked field by field: an ApiError also carries the request's headers, token included.
// The token is cut out of the text too: the gateway repeats a token it rejects in its error.
const describeError = ({ name, message, statusCode, errorCode, stack }, token) => {
    const redact = (text = "") => (token ? text.split(token).join("[token]") : text);
    return {
        name,
        message: redact(message).slice(0, MAX_ERROR_MESSAGE_LENGTH),
        statusCode,
        errorCode,
        stack: redact(stack).slice(0, MAX_ERROR_STACK_LENGTH),
    };
};

/**
 * Why a print link can't be served, for `log.rejected`, or null when it is complete.
 *
 * @param {{ token?: string, mode?: string, validModes: Set<string>, required: Record<string, unknown> }} link
 *   `required` maps each further field the page needs to its value.
 */
export const invalidLinkReason = ({ token, mode, validModes, required }) => {
    if (!token) return "missing token";
    if (!mode) return "missing mode";
    if (!validModes.has(mode)) return "unknown mode";
    const missing = Object.keys(required).find((field) => !required[field]);
    return missing ? `missing ${missing}` : null;
};

/**
 * Wraps a printing page so every request logs one outcome. The page gets `log` as
 * its second argument to report what it handles itself: `failed` for an error,
 * `rejected` for a request it won't print. Anything else it throws is logged here
 * and rethrown; a redirect is a throw too, but not a crash. Failures are written in
 * every environment; successes and rejections only when APP_ENV is `testing`.
 *
 * @param {(props: object) => object} contextOf - What identifies the document, from the page's props.
 * @param {(props: object, log: { failed: (error: Error) => void, rejected: (reason: string) => void }) => Promise<import("react").ReactNode>} Page
 */
export const withPrintLog = (contextOf, Page) => async function LoggedPrintingPage(props) {
    const context = pickContext(contextOf(props));
    const identity = JSON.stringify(context); // without the url, so noise in a link can't get past the repeat limit
    const line = { ...context, url: printUrl(props, context.route) };
    const token = props.searchParams?.token;
    let outcomeLogged = false;
    const log = {
        failed(error) {
            outcomeLogged = true;
            const description = describeError(error, token);
            writeUnlessRepeat(`failed|${identity}|${description.message}`, (repeats) =>
                errorLogger.error({ message: "print failed", ...line, ...repeats, error: description }));
        },
        rejected(reason) {
            outcomeLogged = true;
            if (!isTestingEnvironment()) return;
            // By reason only, so links with ever-changing values can't get past the limit.
            writeUnlessRepeat(`rejected|${context.route}|${reason}`, (repeats) =>
                printLogger.warn({ message: "print rejected", ...line, ...repeats, reason }));
        },
    };
    let output;
    try {
        output = await Page(props, log);
    } catch (error) {
        if (!outcomeLogged && !isRedirectError(error)) {
            log.failed(error);
        }
        throw error;
    }
    if (!outcomeLogged && isTestingEnvironment()) {
        writeUnlessRepeat(`succeeded|${identity}`, (repeats) =>
            printLogger.info({ message: "print succeeded", ...line, ...repeats }));
    }
    return output;
};
