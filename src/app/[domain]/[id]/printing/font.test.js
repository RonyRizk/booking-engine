import { afterEach, describe, expect, test } from "bun:test";
import BookingPrintingPage from "./page";
import FiscalDocumentsPage from "./fd/page";
import CityLedgerPrintingPages from "./cl/page";
import DocumentPage from "./doc/page";
import { invoiceFor, installPrintingGateway, printableBooking, renderPage, withFdLanguage } from "@/test/fixtures/printing";
import { installCityLedgerGateway, renderCityLedger } from "@/test/fixtures/city-ledger";

/** Each printed document, rendered in `lang`; returns `[html, restoreGateway]`. */
const documents = {
    "booking printing": async (lang) => {
        const data = printableBooking();
        const gateway = installPrintingGateway({ ...data, results: { "/Get_Booking_Invoice_Info": invoiceFor(data.booking) } });
        return [await renderPage(BookingPrintingPage, { mode: "printing", id: data.booking.booking_nbr, lang }), gateway];
    },
    "fiscal invoice": async (lang) => {
        const data = printableBooking();
        const gateway = installPrintingGateway({ ...data, property: withFdLanguage(data.property, lang), results: { "/Get_Booking_Invoice_Info": invoiceFor(data.booking) } });
        return [await renderPage(FiscalDocumentsPage, { mode: "invoice", id: data.booking.booking_nbr, documentId: "INV-19" }), gateway];
    },
    "fiscal booking print": async (lang) => {
        const data = printableBooking();
        const gateway = installPrintingGateway({ ...data, property: withFdLanguage(data.property, lang), results: { "/Get_Booking_Invoice_Info": invoiceFor(data.booking) } });
        return [await renderPage(FiscalDocumentsPage, { mode: "printing", id: data.booking.booking_nbr }), gateway];
    },
    "city ledger invoice": async (lang) => {
        const { gateway } = installCityLedgerGateway({ lang });
        return [await renderCityLedger(CityLedgerPrintingPages, { mode: "invoice", docNo: "INV-19" }), gateway];
    },
    "consent document": async (lang) => {
        const data = printableBooking();
        const gateway = installPrintingGateway({ ...data, property: withFdLanguage(data.property, lang) });
        return [await renderPage(DocumentPage, { mode: "consent", id: data.booking.booking_nbr, room_identifier: data.booking.rooms[1].identifier }), gateway];
    },
};

const CAIRO_STYLESHEET = /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?family=Cairo[^"]*"/;
const CAIRO_BODY = /body\s*\{\s*font-family:\s*Cairo,/;

describe("printing font", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    test.each(Object.keys(documents))("the %s is set in Cairo when printed in Arabic", async (name) => {
        let html;
        [html, gateway] = await documents[name]("ar");

        expect([CAIRO_STYLESHEET.test(html), CAIRO_BODY.test(html)]).toEqual([true, true]);
    });

    test.each(Object.keys(documents))("the %s keeps its usual font in other languages", async (name) => {
        let html;
        [html, gateway] = await documents[name]("fr");

        expect(html).not.toContain("Cairo");
    });
});
