import moment from "moment";

const DATE_STYLES = {
    short: { month: "short", day: "2-digit", year: "numeric" },
    long: { month: "long", day: "2-digit", year: "numeric" },
    full: { weekday: "long", day: "2-digit", month: "short", year: "numeric" },
    dmy: { day: "2-digit", month: "short", year: "numeric" },
    dayMonth: { weekday: "short", day: "2-digit", month: "2-digit" },
    time: { hour: "2-digit", minute: "2-digit" },
};

/**
 * Styles assembled from the date's parts in a fixed order, so every language
 * keeps the layout the English documents always had.
 */
const ASSEMBLED_STYLES = {
    // moment's `dddd, DD MMM YYYY`: "Saturday, 27 Sep 2025"
    full: (p) => `${p.weekday}, ${p.day} ${p.month} ${p.year}`,
    // moment's `DD-MMM-YYYY`: "27-Sep-2025"
    dmy: (p) => `${p.day}-${p.month}-${p.year}`,
    // "27/09 Sa": the day under a nightly rate
    dayMonth: (p, lang) => `${p.day}/${p.month} ${lang === "en" ? englishDayAbbr(p.weekday) : p.weekday}`,
};

/** English nightly-rate weekdays: Thu, Sat and Sun keep two letters, the rest one. */
const englishDayAbbr = (weekday) => (["Thu", "Sat", "Sun"].includes(weekday) ? weekday.slice(0, 2) : weekday.charAt(0));

/** igloorooms language codes that differ from their BCP 47 tag. */
const LOCALE_TAGS = { ua: "uk" };

/**
 * Builds a translator over a localized bundle.
 *
 * Lookup order is `entries` → `fallback` → the key itself, so a label missing
 * from the API still renders its English default instead of disappearing.
 * `%1`, `%2`, … placeholders are filled from the extra arguments.
 *
 * @param {Object} options
 * @param {Record<string, string>} [options.entries] - Localized strings from Get_Exposed_Language.
 * @param {Record<string, string>} [options.fallback] - Default (English) strings.
 * @param {'ltr'|'rtl'} [options.direction]
 * @param {string} [options.lang]
 */
export function createTranslator({ entries = {}, fallback = {}, direction = "ltr", lang = "en" } = {}) {
    const locale = `${LOCALE_TAGS[lang] ?? (lang || "en")}-u-nu-latn`;

    const t = (key, ...args) => {
        const template = entries?.[key] || fallback[key] || key;
        return args.reduce((str, arg, i) => str.replaceAll(`%${i + 1}`, String(arg ?? "")), template);
    };

    let pluralRules;
    try {
        pluralRules = new Intl.PluralRules(locale);
    } catch {
        pluralRules = new Intl.PluralRules("en");
    }
    t.plural = (count, oneKey, otherKey) => t(pluralRules.select(count) === "one" ? oneKey : otherKey, count);

    const formatters = {};
    const getFormatter = (style) => {
        if (!formatters[style]) {
            try {
                formatters[style] = new Intl.DateTimeFormat(locale, DATE_STYLES[style]);
            } catch {
                formatters[style] = new Intl.DateTimeFormat("en", DATE_STYLES[style]);
            }
        }
        return formatters[style];
    };

    /**
     * Formats a date the way moment's `MMM DD, YYYY` (`short`) or
     * `MMMM DD, YYYY` (`long`) did, in the translator's language. `full`,
     * `dmy` and `dayMonth` keep the legacy prints' layouts (see ASSEMBLED_STYLES).
     * Plain `YYYY-MM-DD` strings are parsed as local dates.
     */
    const formatDate = (input, style = "short") => {
        if (input === null || input === undefined || input === "") return "—";
        const date = moment.isMoment(input)
            ? input
            : typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)
                ? moment(input, "YYYY-MM-DD")
                : moment(input);
        if (!date.isValid()) return String(input);
        const assemble = ASSEMBLED_STYLES[style];
        if (!assemble) {
            return getFormatter(style).format(date.toDate());
        }
        const parts = Object.fromEntries(getFormatter(style).formatToParts(date.toDate()).map((p) => [p.type, p.value]));
        return assemble(parts, lang || "en");
    };

    /** A time of day on the language's own clock: "04:03 PM" in English, "16:03" in French. */
    const formatTime = (hour, minute) => {
        const h = Number(hour);
        const m = Number(minute);
        if (!Number.isFinite(h) || !Number.isFinite(m)) return "—";
        return getFormatter("time").format(new Date(2000, 0, 1, h, m));
    };

    return { t, lang: lang || "en", dir: direction === "rtl" ? "rtl" : "ltr", formatDate, formatTime };
}
