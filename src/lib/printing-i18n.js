import * as React from "react";
import { createLabels, DEFAULT_LANG, fetchLabels, FD_LABELS, resolveLang } from "./labels";

// Request-scoped: `cache` memoizes per server render, so each request gets its
// own store and nested server components can read the translator the page set.
// `cache` only exists under the react-server condition. Tests run outside it and
// share one module-level store; anywhere else that store would leak one
// request's language into another, so refuse to run instead.
const cache = React.cache ?? ((fn) => {
    if (process.env.NODE_ENV !== "test") {
        throw new Error("printing-i18n needs React.cache: import it from server components only.");
    }
    let value;
    return () => (value ??= fn());
});
const getStore = cache(() => ({ i18n: createLabels(FD_LABELS, "en", null) }));

/** The translator for the current request; English defaults until a page loads one. */
export function getI18n() {
    return getStore().i18n;
}

/**
 * Installs `i18n` as this request's translator.
 *
 * @param {ReturnType<typeof createLabels>} i18n
 */
export function installPrintingLabels(i18n) {
    getStore().i18n = i18n;
    return i18n;
}

/**
 * Loads the `_FD_LABELS` translator for `lang` and installs it for this request,
 * so every component rendered below reads it via `getI18n()`. Call it in the page
 * before returning JSX. A failed language call leaves the English defaults.
 *
 * @param {string | string[] | undefined} lang
 * @param {string | null | undefined} token
 */
export async function loadPrintingLabels(lang, token) {
    return installPrintingLabels(await fetchLabels(FD_LABELS, lang, { token }));
}

/**
 * Starts loading a fiscal document's property, which also decides the document's
 * language (its `FD_LANGUAGE` extra info, English when unset). The language is only
 * known once the property is, so the property is read in English and read again in
 * the document's language if that differs. Both are promises so requests that don't
 * need the language can start alongside.
 *
 * @param {import("@/lib/services/common.service").CommonServices} commonService
 * @param {string} aName
 * @returns {{ lang: Promise<string>, property: Promise<object> }}
 */
export function loadDocumentProperty(commonService, aName) {
    const english = commonService.getExposedProperty(aName, DEFAULT_LANG);
    const lang = english.then((p) => resolveLang(p?.extra_info?.find((e) => e.key === "FD_LANGUAGE")?.value));
    const property = lang.then((code) => (code === DEFAULT_LANG ? english : commonService.getExposedProperty(aName, code)));
    return { lang, property };
}
