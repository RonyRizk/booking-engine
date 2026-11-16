import { createTranslator } from "../i18n";
import { CommonServices } from "../services/common.service";
import emailLabels from "./email-labels.json";
import fdLabels from "./fd-labels.json";

/** Setup table holding every label the emails render. */
export const EMAIL_LABELS = "_EMAIL_LABELS";

/** Setup table holding every label the printed documents render. */
export const FD_LABELS = "_FD_LABELS";

/** Languages every `_FD_LABELS` row is translated into (`CODE_VALUE_<lang>`). */
export const LABEL_LANGUAGES = ["AR", "DE", "EL", "EN", "FR", "HE", "PL", "RU", "UA"];

export const DEFAULT_LANG = "en";

/**
 * Normalizes a `lang` param. Next passes repeated search params as an array;
 * missing, empty or blank values fall back to English.
 *
 * @param {string | string[] | undefined} lang
 * @returns {string}
 */
export function resolveLang(lang) {
    const value = Array.isArray(lang) ? lang[0] : lang;
    return (typeof value === "string" && value.trim().toLowerCase()) || DEFAULT_LANG;
}

/** Right-to-left languages, whatever direction the gateway reports. */
const RTL_LANGS = ["ar", "he"];

const ENGLISH = {
    [EMAIL_LABELS]: emailLabels[EMAIL_LABELS],
    [FD_LABELS]: Object.fromEntries(fdLabels.map((row) => [row.CODE_NAME, row.CODE_VALUE_EN])),
};

/**
 * Builds the translator for one label table.
 *
 * @param {string} table - EMAIL_LABELS or FD_LABELS.
 * @param {string} lang
 * @param {{ entries?: Record<string, string>, direction?: 'ltr'|'rtl' } | null} [bundle]
 */
export function createLabels(table, lang, bundle) {
    lang = resolveLang(lang);
    return createTranslator({
        entries: bundle?.entries,
        direction: RTL_LANGS.includes(lang) ? "rtl" : bundle?.direction,
        fallback: ENGLISH[table],
        lang,
    });
}

/**
 * Fetches `table` in `lang` from Get_Exposed_Language and returns its translator.
 * Without a token, or when the request fails, it renders the English defaults.
 *
 * @param {string} table - EMAIL_LABELS or FD_LABELS.
 * @param {string | string[] | undefined} lang
 * @param {{ token?: string | null, headers?: Record<string, string> }} [options]
 */
export async function fetchLabels(table, lang, { token, headers = {} } = {}) {
    lang = resolveLang(lang);
    if (!token) {
        return createLabels(table, lang, null);
    }
    const commonService = new CommonServices("https://gateway.igloorooms.com/IRBE");
    commonService.setToken(token);
    commonService.setDefaultHeaders(headers);
    const bundle = await commonService.getExposedLanguage(lang, [table]).catch(() => null);
    return createLabels(table, lang, bundle);
}
