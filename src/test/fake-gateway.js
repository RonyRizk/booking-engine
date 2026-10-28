import axios from "axios";

export const IR = "https://gateway.igloorooms.com/IR";
export const IRALPHA = "https://gateway.igloorooms.com/IRALPHA";

const DEFAULT_RESULTS = {
    "/Get_Exposed_Language": { entries: [], direction: "ltr" },
    "/Get_Setup_Entries_By_TBL_NAME_Multi": [],
};

/**
 * Replaces axios' network adapter so no request leaves the process.
 * Every request is recorded as `{ baseURL, endpoint }` and answered with
 * `{ My_Result }` taken from `results[endpoint]`, then DEFAULT_RESULTS, else null.
 *
 * @param {Record<string, unknown>} [results] - My_Result per endpoint path.
 * @returns {{ requests: {baseURL: string, endpoint: string}[], restore: () => void }}
 */
export const installFakeGateway = (results = {}) => {
    const originalAdapter = axios.defaults.adapter;
    const requests = [];
    axios.defaults.adapter = async (config) => {
        requests.push({ baseURL: config.baseURL, endpoint: config.url });
        const My_Result = results[config.url] ?? DEFAULT_RESULTS[config.url] ?? null;
        return { data: { My_Result, ExceptionMsg: "" }, status: 200, statusText: "OK", headers: {}, config, request: {} };
    };
    return {
        requests,
        restore: () => {
            axios.defaults.adapter = originalAdapter;
        },
    };
};
