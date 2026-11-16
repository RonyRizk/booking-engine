import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import BookingPrintingPage from "./page";
import { otaBooking } from "@/test/fixtures/bookings";
import { installPrintingGateway, invoiceFor, paymentSetupRows, printableBooking, renderPage } from "@/test/fixtures/printing";
import { heldAnswer, settle } from "@/test/helpers/fake-gateway";
import { visibleText } from "@/test/helpers/render";
import { labelsResult, markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";
import { capturePrintLog } from "@/test/helpers/print-log";

const MODES = {
    printing: {},
    invoice: { documentId: "INV-19" },
    creditnote: { documentId: "INV-19" },
    receipt: { pid: "5", rnb: "R-5" },
};

describe("booking printing page", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    const render = async (data, mode, lang = "en", labels) => {
        gateway = installPrintingGateway({ ...data, labels, results: { "/Get_Booking_Invoice_Info": invoiceFor(data.booking) } });
        return renderPage(BookingPrintingPage, { mode, id: data.booking.booking_nbr, lang, ...MODES[mode] });
    };

    test.each(NON_LATIN_LANGS.flatMap((lang) => Object.keys(MODES).map((mode) => [mode, lang])))(
        "the %s print in %s shows only _FD_LABELS text and booking data",
        async (mode, lang) => {
            const data = printableBooking();
            const html = await render(data, mode, lang, markedLabels("_FD_LABELS"));

            expect([untranslatedWords(html, [data, paymentSetupRows, invoiceFor(data.booking)]), rawLabelKeys(html)]).toEqual([[], []]);
        },
    );

    const textOf = async (data, mode, extra = {}, { invoice = invoiceFor(data.booking), lang = "en", labels, results = {} } = {}) => {
        gateway = installPrintingGateway({ ...data, labels, results: { "/Get_Booking_Invoice_Info": invoice, "/Mark_Payment_As_Receipt_Issued": {}, ...results } });
        return visibleText(await renderPage(BookingPrintingPage, { mode, id: data.booking.booking_nbr, lang, ...MODES[mode], ...extra }));
    };

    test("renders the labels in the language the gateway returns", async () => {
        const text = await textOf(printableBooking(), "printing", {}, { lang: "fr", labels: labelsResult({ Lcz_GuestFolio: "Folio du client" }) });

        expect(text).toContain("Folio du client");
    });

    test("an Arabic print is laid out right-to-left", async () => {
        const data = printableBooking();
        gateway = installPrintingGateway(data);

        expect(await renderPage(BookingPrintingPage, { mode: "printing", id: data.booking.booking_nbr, lang: "ar" })).toContain('dir="rtl"');
    });

    describe("booking print", () => {
        test("shows the stay with its nights and each night's rate", async () => {
            const text = await textOf(printableBooking(), "printing");

            expect([text.includes("ACCOMMODATION Sep 27, 2025 Sep 29, 2025 2 nights"), text.includes("27/09 Sa US$ 60.00")]).toEqual([true, true]);
        });

        test("shows the guest's card, notes and expected departure time", async () => {
            const text = await textOf(printableBooking(), "printing");

            expect([text.includes("Card details Name: Test Test"), text.includes("Guest notes: Late check-in"), text.includes("(Expected departure time: 11:00)")]).toEqual([true, true, true]);
        });

        test("lists every payment in the guest folio", async () => {
            const text = await textOf(printableBooking(), "printing");

            expect(text).toContain("Guest folio Date Amount Designation Ref 20-Sep-2025 US$ 150.00 Payment: Credit card REF-5 20-Sep-2025 - US$ 20.00 Refund: Credit card REF-6 20-Sep-2025 US$ 40.00 Credit card REF-7");
        });

        test("shows the airport pickup and the extra services", async () => {
            const text = await textOf(printableBooking(), "printing");

            expect([
                text.includes("PICKUP Yes, from Beirut airport"),
                text.includes("Arrival date: Saturday, 27 Sep 2025 Arrival Time: 04:03 PM Flight details: ME 211"),
                text.includes("Extra Services Spa access ( Saturday, 27 Sep 2025 - Sunday, 28 Sep 2025 ) US$ 25.00"),
            ]).toEqual([true, true, true]);
        });

        test("shows when the booking was made", async () => {
            expect(await textOf(printableBooking(), "printing")).toContain("18-Sep-2025 04:03 PM");
        });

        test("a channel booking shows its channel number, meal plan and policies", async () => {
            const data = otaBooking();
            data.booking.rooms[0].ota_meta = { meal_plan: "Breakfast included", policies: "Non refundable" };

            const text = await textOf(data, "printing");

            expect([text.includes(data.booking.channel_booking_nbr), text.includes("Meal plan: Breakfast included"), text.includes("Policies: Non refundable")]).toEqual([true, true, true]);
        });

        test("has no invoice footer", async () => {
            expect(await textOf(printableBooking(), "printing")).not.toContain("Thank you for staying with us.");
        });
    });

    describe("invoice", () => {
        test("is titled with its number and dated the day it was issued", async () => {
            const text = await textOf(printableBooking(), "invoice");

            expect([text.startsWith("Invoice Invoice no.: INV-19 Date of issue: September 30, 2025"), text.includes("Thank you for staying with us.")]).toEqual([true, true]);
        });

        test("is billed to the guest and shows the issuing company", async () => {
            const text = await textOf(printableBooking(), "invoice");

            expect([text.includes("Bill to Name: Test Test"), text.includes("Demo Hotel SAL"), text.includes("Tax ID: TX-778")]).toEqual([true, true, true]);
        });

        test("an invoice issued to the company is billed to the company", async () => {
            const data = printableBooking();
            data.booking.company_name = "Acme Travel";
            data.booking.company_tax_nbr = "ACME-1";

            const text = await textOf(data, "invoice", {}, { invoice: invoiceFor(data.booking, { target: { code: "002" } }) });

            expect(text).toContain("Bill to Acme Travel ACME-1");
        });

        test("only prints the rooms the invoice covers", async () => {
            const data = printableBooking();
            const [first, second] = data.booking.rooms;
            const invoice = invoiceFor(data.booking);
            invoice.invoices[0].items = invoice.invoices[0].items.filter((i) => i.key !== second.system_id);

            const text = await textOf(data, "invoice", {}, { invoice });

            expect([text.includes(first.roomtype.name), text.includes(second.roomtype.name)]).toEqual([true, false]);
        });

        test("prints the cancellation penalty the invoice charges", async () => {
            expect(await textOf(printableBooking(), "invoice")).toContain("Cancellation penalty ( Saturday, 20 Sep 2025 ) US$ 40.00");
        });

        test("leaves out the cancellation penalty when the invoice doesn't charge it", async () => {
            const data = printableBooking();
            const invoice = invoiceFor(data.booking);
            invoice.invoices[0].items = invoice.invoices[0].items.filter((i) => i.type !== "PAYMENT");

            expect(await textOf(data, "invoice", {}, { invoice })).not.toContain("Cancellation penalty");
        });

        test("an invoice number that doesn't exist still prints, without a date", async () => {
            expect(await textOf(printableBooking(), "invoice", { documentId: "INV-404" })).toContain("Invoice no.: INV-404 Booking #");
        });
    });

    describe("credit note", () => {
        test("refers to the invoice it credits and lists the credited items", async () => {
            const text = await textOf(printableBooking(), "creditnote");

            expect([text.includes("Credit note no.: CN-3 For original invoice no.: INV-19"), text.includes("Credited items ACCOMMODATION")]).toEqual([true, true]);
        });

        test("shows how it changes the original invoice", async () => {
            const data = printableBooking();
            const text = await textOf(data, "creditnote");

            expect(text).toContain("Effects on original invoice Original invoice total: US$ 444.00 Less: credit note: - US$ 444.00 Revised net amount: US$ 0.00");
        });
    });

    describe("receipt", () => {
        test("shows the payment received, its method and reference", async () => {
            const text = await textOf(printableBooking(), "receipt");

            expect(text).toContain("Payment received: US$ 150.00 Method: Credit card Reference: REF-5");
        });

        test("names the payment method in the document's language", async () => {
            expect(await textOf(printableBooking(), "receipt", {}, { lang: "fr" })).toContain("Carte de crédit");
        });

        test("is numbered and dated with the payment", async () => {
            expect(await textOf(printableBooking(), "receipt")).toContain("Receipt no.: R-5 Date of issue: September 20, 2025");
        });

        test("marks a payment's receipt as issued the first time it is printed", async () => {
            const data = printableBooking();
            data.booking.financial.payments[0].is_receipt_issued = false;

            await textOf(data, "receipt");

            expect(gateway.requests.filter((r) => r.endpoint === "/Mark_Payment_As_Receipt_Issued").map((r) => r.body)).toEqual([{ payment_id: "5", receipt_nbr: "R-5" }]);
        });

        test("is only returned once its payment is marked", async () => {
            const data = printableBooking();
            data.booking.financial.payments[0].is_receipt_issued = false;
            const marking = heldAnswer({});
            let returned = false;
            const rendering = textOf(data, "receipt", {}, { results: { "/Mark_Payment_As_Receipt_Issued": marking.answer } }).then(() => {
                returned = true;
            });
            await settle();
            await settle();
            const returnedBeforeMarked = returned;

            marking.release();
            await rendering;

            expect(returnedBeforeMarked).toBe(false);
        });

        test("still prints when marking it fails", async () => {
            const data = printableBooking();
            data.booking.financial.payments[0].is_receipt_issued = false;
            const results = { "/Mark_Payment_As_Receipt_Issued": new Error("Marking service down") };

            expect(await textOf(data, "receipt", {}, { results })).toContain("R-5");
        });

        test("doesn't mark a receipt that was already issued", async () => {
            await textOf(printableBooking(), "receipt");

            expect(gateway.requests.some((r) => r.endpoint === "/Mark_Payment_As_Receipt_Issued")).toBe(false);
        });

        test("a payment that doesn't exist prints no payment block", async () => {
            expect(await textOf(printableBooking(), "receipt", { pid: "999" })).not.toContain("Payment received");
        });
    });

    test("a booking that doesn't exist prints nothing", async () => {
        const data = printableBooking();
        gateway = installPrintingGateway({ booking: null, property: data.property });

        expect(await renderPage(BookingPrintingPage, { mode: "printing", id: "1", lang: "en" })).toBe("");
    });

    test("when the gateway fails it sends the user back to the booking list", async () => {
        gateway = installPrintingGateway({ results: { "/Get_Exposed_Booking": new Error("Booking service down") } });

        const error = await renderPage(BookingPrintingPage, { mode: "printing", id: "1", lang: "en" }).catch((e) => e);

        expect(error.digest).toContain("https://x.igloorooms.com/manage/acbookinglist.aspx");
    });

    describe("print log", () => {
        let log;
        beforeEach(() => {
            log = capturePrintLog();
        });
        afterEach(() => log.restore());

        test("a printed document is logged once, naming what was printed", async () => {
            await textOf(printableBooking(), "invoice");

            expect(log.entries()).toEqual([
                expect.objectContaining({ level: "info", message: "print succeeded", route: "booking", mode: "invoice", property: "a35", booking: "80347800505", document: "INV-19", lang: "en" }),
            ]);
        });

        test("a gateway failure is logged with its cause before sending the user away", async () => {
            gateway = installPrintingGateway({ results: { "/Get_Exposed_Booking": new Error("Booking service down") } });

            await renderPage(BookingPrintingPage, { mode: "printing", id: "1", lang: "en" }).catch(() => {});

            expect(log.entries()).toEqual([
                expect.objectContaining({ level: "error", message: "print failed", route: "booking", booking: "1", error: expect.objectContaining({ message: "Booking service down" }) }),
            ]);
        });

        test("a booking that doesn't exist is logged as a warning, not as a failure", async () => {
            gateway = installPrintingGateway({ booking: null, property: printableBooking().property });

            await renderPage(BookingPrintingPage, { mode: "printing", id: "1", lang: "en" });

            expect(log.entries()).toEqual([expect.objectContaining({ level: "warn", message: "print rejected", reason: "booking not found" })]);
        });
    });
});
