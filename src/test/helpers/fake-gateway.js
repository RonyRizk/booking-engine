import axios from "axios";

export const IR = "https://gateway.igloorooms.com/IR";
export const IRALPHA = "https://gateway.igloorooms.com/IRALPHA";

const DEFAULT_RESULTS = {
    "/Get_Exposed_Language": { entries: [], direction: "ltr" },
    "/Get_Setup_Entries_By_TBL_NAME_Multi": [],
};

/** Some endpoints are posted to an absolute URL; key results by the path alone. */
const toEndpoint = (url = "") => (/^https?:\/\//.test(url) ? `/${url.split("/").pop()}` : url);

const parseBody = (data) => {
    try {
        return typeof data === "string" ? JSON.parse(data) : data ?? null;
    } catch {
        return data;
    }
};

/**
 * Replaces axios' network adapter so no request leaves the process.
 * Every request is recorded as `{ baseURL, endpoint, body, authorization }` (`baseURL` is
 * the gateway actually hit, also for absolute URLs) and answered with
 * `{ My_Result }` taken from `results[endpoint]`, then DEFAULT_RESULTS, else null.
 * A result that is an `Error` is answered as a gateway failure (`ExceptionMsg`); a function is
 * called with the request body and its (awaited) return value is the answer.
 *
 * @param {Record<string, unknown>} [results] - My_Result per endpoint path.
 * @returns {{ requests: {baseURL: string, endpoint: string, body: unknown, authorization: string | undefined}[], restore: () => void }}
 */
export const installFakeGateway = (results = {}) => {
    const originalAdapter = axios.defaults.adapter;
    const requests = [];
    axios.defaults.adapter = async (config) => {
        const endpoint = toEndpoint(config.url);
        const baseURL = /^https?:\/\//.test(config.url ?? "") ? config.url.slice(0, -endpoint.length) : config.baseURL;
        requests.push({ baseURL, endpoint, body: parseBody(config.data), authorization: config.headers?.Authorization });
        const result = results[endpoint] ?? DEFAULT_RESULTS[endpoint] ?? null;
        const data = result instanceof Error
            ? { My_Result: null, ExceptionMsg: result.message }
            : { My_Result: typeof result === "function" ? await result(parseBody(config.data)) : result, ExceptionMsg: "" };
        return { data, status: 200, statusText: "OK", headers: {}, config, request: {} };
    };
    return {
        requests,
        restore: () => {
            axios.defaults.adapter = originalAdapter;
        },
    };
};

/** The `{ code, sections }` body of every Get_Exposed_Language request. */
export const labelRequests = (requests) =>
    requests.filter((r) => r.endpoint === "/Get_Exposed_Language").map((r) => r.body);

/**
 * A gateway answer held back until `release()` — lets a test observe which
 * requests start while another is still loading.
 *
 * @param {unknown} value - What the endpoint answers once released.
 */
export const heldAnswer = (value) => {
    let release;
    const gate = new Promise((resolve) => {
        release = resolve;
    });
    return { answer: () => gate.then(() => value), release };
};

/** Lets every request already started reach the fake gateway. */
export const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

/** The gateways `requests` hit for data. Labels always come from IRBE's Get_Exposed_Language, so they are left out. */
export const gatewaysHit = (requests) => [...new Set(requests.filter((r) => r.endpoint !== "/Get_Exposed_Language").map((r) => r.baseURL))];

/** The endpoint of every request, in order. */
export const endpointsHit = (requests) => requests.map((r) => r.endpoint);
