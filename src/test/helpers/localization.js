import emailLabels from "@/lib/labels/email-labels.json";
import fdLabels from "@/lib/labels/fd-labels.json";
import { visibleText } from "@/test/helpers/render";

const LABELS = {
    _EMAIL_LABELS: emailLabels._EMAIL_LABELS,
    _FD_LABELS: Object.fromEntries(fdLabels.map((row) => [row.CODE_NAME, row.CODE_VALUE_EN])),
};

/** Languages written in a non-Latin script: any English left on screen stands out. */
export const NON_LATIN_LANGS = ["ar", "he", "ru", "ua", "el"];

/**
 * A Get_Exposed_Language result where every label of `table` renders as
 * `⟦Lcz_Key⟧`, keeping its `%1` placeholders. Rendering a screen with it shows
 * which text came from the table and which was hardcoded.
 *
 * @param {"_EMAIL_LABELS" | "_FD_LABELS"} table
 */
export const markedLabels = (table) => ({
    direction: "RTL",
    entries: Object.entries(LABELS[table]).map(([code, english]) => ({
        code,
        description: `⟦${code}⟧ ${(english.match(/%\d/g) ?? []).join(" ")}`.trim(),
    })),
});

/** A Get_Exposed_Language result translating the given keys. */
export const labelsResult = (entries, direction = "LTR") => ({
    direction,
    entries: Object.entries(entries).map(([code, description]) => ({ code, description })),
});

const stringsIn = (value, out = new Set()) => {
    if (typeof value === "string") {
        if (value.trim()) out.add(value.trim());
    } else if (typeof value === "number") {
        out.add(String(value));
    } else if (Array.isArray(value)) {
        value.forEach((v) => stringsIn(v, out));
    } else if (value && typeof value === "object") {
        Object.values(value).forEach((v) => stringsIn(v, out));
    }
    return out;
};

/** Company names printed as-is in every language. */
const BRAND_NAMES = ["igloorooms LLC", "igloorooms"];

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Latin words left on a screen rendered with `markedLabels` once every label
 * (`⟦…⟧`) and every string of the data it was rendered from are removed. Each
 * one is English the screen hardcodes instead of reading from its label table.
 *
 * @param {string} html
 * @param {unknown[]} data - Everything the screen was rendered from.
 * @returns {string[]}
 */
export const untranslatedWords = (html, data = []) => {
    let text = visibleText(html).replace(/⟦Lcz_[A-Za-z0-9_]+⟧/gi, " ");
    // Data values may be embedded HTML; compare against their visible text too.
    const values = [...stringsIn(data)].flatMap((v) => [v, visibleText(v)]).filter((v) => /[A-Za-z]/.test(v));
    for (const value of [...new Set(values)].sort((a, b) => b.length - a.length)) {
        text = text.replace(new RegExp(`(?<![A-Za-z])${escapeRegExp(value)}(?![A-Za-z])`, "gi"), " ");
    }
    for (const brand of BRAND_NAMES) {
        text = text.replaceAll(brand, " ");
    }
    return [...new Set(text.match(/[A-Za-z]{2,}/g) ?? [])];
};

/** Labels that rendered as their raw key because no table translates them. */
export const rawLabelKeys = (html) => [...new Set(visibleText(html).replace(/⟦Lcz_[A-Za-z0-9_]+⟧/gi, "").match(/Lcz_[A-Za-z0-9_]+/g) ?? [])];
