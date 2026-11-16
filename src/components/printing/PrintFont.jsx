import { getI18n } from "@/lib/printing-i18n";

const CAIRO_STYLESHEET = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap";

/**
 * The typeface of a printed document in its language: Arabic documents are set in
 * Cairo, every other language keeps the stylesheets' system font. Render it once
 * per page, inside the tree that loaded the request's labels.
 *
 * The stylesheet is only requested for Arabic, so other documents make no extra
 * request. `html body` outranks the stylesheets' `body { font-family … !important }`.
 */
export default function PrintFont() {
    if (getI18n().lang !== "ar") return null;
    return (
        <>
            <link rel="stylesheet" href={CAIRO_STYLESHEET} />
            <style>{"html body { font-family: Cairo, sans-serif !important; }"}</style>
        </>
    );
}
