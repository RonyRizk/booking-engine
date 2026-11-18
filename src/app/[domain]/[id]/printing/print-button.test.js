import { afterEach, describe, expect, test } from "bun:test";
import FiscalDocumentsPage from "./fd/page";
import DocumentPage from "./doc/page";
import { installPrintingGateway, printableBooking, renderPage, withFdLanguage } from "@/test/fixtures/printing";

/** The documents people print themselves, rendered in `lang`; returns `[html, gateway]`. */
const documents = {
    "booking print": async (lang) => {
        const data = printableBooking();
        const gateway = installPrintingGateway({ ...data, property: withFdLanguage(data.property, lang) });
        return [await renderPage(FiscalDocumentsPage, { mode: "printing", id: data.booking.booking_nbr }), gateway];
    },
    "consent document": async (lang) => {
        const data = printableBooking();
        const gateway = installPrintingGateway({ ...data, property: withFdLanguage(data.property, lang) });
        return [await renderPage(DocumentPage, { mode: "consent", id: data.booking.booking_nbr, room_identifier: data.booking.rooms[1].identifier }), gateway];
    },
};

/** The print button's direction and classes. */
const printButton = (html) => {
    const tag = html.match(/<button[^>]*>/)?.[0] ?? "";
    return { dir: tag.match(/dir="(\w+)"/)?.[1], classes: tag.match(/class="([^"]*)"/)?.[1].split(/\s+/) ?? [] };
};

describe("print button", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    // `start` is the left in LTR and the right in RTL; a fixed element resolves it
    // against its own dir, so the button carries the document's direction.
    test.each(Object.keys(documents).flatMap((name) => [[name, "en", "ltr"], [name, "ar", "rtl"]]))(
        "the %s in %s floats in the bottom corner on the %s start side",
        async (name, lang, dir) => {
            let html;
            [html, gateway] = await documents[name](lang);
            const button = printButton(html);

            expect([button.dir, button.classes]).toEqual([dir, expect.arrayContaining(["fixed", "bottom-4", "start-4"])]);
        },
    );

    test.each(Object.keys(documents))("the %s doesn't print its print button", async (name) => {
        let html;
        [html, gateway] = await documents[name]("en");

        expect(printButton(html).classes).toContain("print:hidden");
    });
});
