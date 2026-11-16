import { afterEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { filesImportedBy } from "@/test/helpers/source-files";
import BookingPrintingPage from "./page";
import FiscalDocumentsPage from "./fd/page";
import DocumentPage from "./doc/page";
import { installPrintingGateway, printableBooking, renderPage, withFdLanguage } from "@/test/fixtures/printing";
import fdLabels from "@/lib/labels/fd-labels.json";

const PRINTING = "src/app/[domain]/[id]/printing";
const FISCAL_PAGES = [`${PRINTING}/fd/page.jsx`, `${PRINTING}/cl/page.jsx`, `${PRINTING}/doc/page.jsx`];

const stripComments = (source) =>
    source
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .split("\n")
        .filter((line) => !line.trim().startsWith("//"))
        .join("\n");

// Tailwind utilities tied to the physical left or right side, with any variant (`print:`, `sm:`, …).
const PHYSICAL_CLASS =
    /(?<![\w-])(?:[a-z]+:)*-?(?:text-(?:left|right)|border-[lr](?:-[\w.[\]]+)?|rounded-(?:[lr]|[tb][lr])(?:-[\w.[\]]+)?|[mp][lr]-[\w.[\]]+|(?:left|right)-[\w.[\]]+|float-(?:left|right)|clear-(?:left|right)|space-x-[\w.[\]]+|divide-x(?:-[\w.[\]]+)?|ltr:[\w.[\]-]+|rtl:[\w.[\]-]+)(?![\w-])/g;
// The same in CSS and in inline style objects.
const PHYSICAL_PROPERTY =
    /(?:margin|padding|border)-(?:left|right)\b|(?:margin|padding|border)(?:Left|Right)\b|text-?[aA]lign\s*:\s*["']?(?:left|right)\b|(?<![\w-])(?:left|right)\s*:|float\s*:\s*["']?(?:left|right)\b/g;

/** Every physical left/right style in `source`; logical start/end ones are what RTL needs. */
const physicalDirections = (source) => {
    const code = stripComments(source);
    return [...(code.match(PHYSICAL_CLASS) ?? []), ...(code.match(PHYSICAL_PROPERTY) ?? [])];
};

describe("fiscal document direction", () => {
    const files = filesImportedBy(FISCAL_PAGES);

    test("covers the pages, their shared primitives, the components they borrow and their stylesheets", () => {
        expect(files).toEqual(expect.arrayContaining([
            ...FISCAL_PAGES,
            `${PRINTING}/shared/print-table.jsx`,
            `${PRINTING}/shared/fiscal-printing.css`,
            `${PRINTING}/printing.css`,
            "src/components/printing/CompanyInfo.jsx",
            "src/components/InfoDisplay.jsx",
        ]));
    });

    test("recognizes physical styles", () => {
        expect(physicalDirections(`<td className="pl-[16pt] print:pr-[4pt] border-r text-left ltr:text-left rtl:text-right sm:mr-4 -ml-2" />`))
            .toEqual(["pl-[16pt]", "print:pr-[4pt]", "border-r", "text-left", "ltr:text-left", "rtl:text-right", "sm:mr-4", "-ml-2"]);
        expect(physicalDirections(".a { padding-left: 1rem; text-align: right; left: 0 }\nstyle={{ marginRight: 4, textAlign: 'left' }}"))
            .toEqual(["padding-left", "text-align: right", "left:", "marginRight", "textAlign: 'left"]);
        expect(physicalDirections(`<td className="ps-4 pe-1.5 border-e text-start text-end ms-2 border-x px-2 items-end" />`)).toEqual([]);
    });

    test.each(files)("%s uses start/end, never left/right", (file) => {
        expect(physicalDirections(readFileSync(file, "utf8"))).toEqual([]);
    });
});

// ─── Arrows ──────────────────────────────────────────────────────────────────
// An arrow points toward the end of the line, so it has to mirror in RTL. Neither
// an SVG nor a Unicode arrow does that on its own; DirectionalArrow carries the
// .print-arrow class that printing.css mirrors under [dir="rtl"].

const ALL_PAGES = [`${PRINTING}/page.jsx`, ...FISCAL_PAGES];
const ARROW_CHARACTER = /[←→↔⇐⇒⇔⟵⟶➔➜➝➞]|&[lr]arr;|\\u219[0-2]|\\u21D[02]/g;
const ARROW_SVG_PATH = "M566.6 342.6";
const DIRECTIONAL_ARROW = "src/components/printing/micro/DirectionalArrow.jsx";

describe("arrows in RTL", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    const files = filesImportedBy(ALL_PAGES);

    test("printing.css mirrors .print-arrow in RTL documents", () => {
        expect(readFileSync(`${PRINTING}/printing.css`, "utf8")).toMatch(/\[dir="rtl"\]\s+\.print-arrow\s*\{\s*transform:\s*scaleX\(-1\)/);
    });

    test.each(files.filter((file) => file !== DIRECTIONAL_ARROW))("%s draws arrows only through DirectionalArrow", (file) => {
        const code = stripComments(readFileSync(file, "utf8"));
        expect([code.match(ARROW_CHARACTER) ?? [], code.includes(ARROW_SVG_PATH)]).toEqual([[], false]);
    });

    test("no _FD_LABELS default contains an arrow character", () => {
        const withArrows = fdLabels.filter((row) => Object.values(row).some((value) => String(value).match(ARROW_CHARACTER)));
        expect(withArrows.map((row) => row.CODE_NAME)).toEqual([]);
    });

    test.each([
        ["the legacy booking print", BookingPrintingPage, () => ({ mode: "printing" })],
        ["the fd booking print", FiscalDocumentsPage, () => ({ mode: "printing" })],
        ["the consent document", DocumentPage, ({ booking }) => ({ mode: "consent", room_identifier: booking.rooms[1].identifier })],
    ])("every arrow in %s sits inside the RTL container", async (_, Page, searchParams) => {
        const data = printableBooking();
        gateway = installPrintingGateway({ ...data, property: withFdLanguage(data.property, "ar") });
        const html = await renderPage(Page, { id: data.booking.booking_nbr, lang: "ar", ...searchParams(data) });
        const rtl = html.match(/<main[^>]*dir="rtl"[^>]*>[\s\S]*<\/main>/)?.[0] ?? "";
        const arrows = (text) => text.match(/class="print-arrow[ "]/g)?.length ?? 0;

        expect(arrows(html)).toBeGreaterThan(0);
        expect(arrows(rtl)).toBe(arrows(html));
    });
});
