import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import FiscalDocumentsPage from "./page";
import { installPrintingGateway, invoiceFor, payment, paymentSetupRows, printableBooking, renderPage, withFdLanguage } from "@/test/fixtures/printing";
import { endpointsHit, gatewaysHit, heldAnswer, installFakeGateway, IR, IRALPHA, labelRequests, settle } from "@/test/helpers/fake-gateway";
import { visibleText } from "@/test/helpers/render";
import { labelsResult, markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";
import { capturePrintLog } from "@/test/helpers/print-log";

const MODES = {
    printing: {},
    invoice: { documentId: "INV-19" },
    creditnote: { documentId: "INV-19" },
    receipt: { pid: "5", documentId: "R-5" },
    creditreceipt: { pid: "6", documentId: "CR-6" },
    refund: { pid: "6", documentId: "CR-6" },
    proforma: {},
};

describe("fiscal document page", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    const html = async (data, mode, extra = {}, { invoice = invoiceFor(data.booking), lang = "en", labels, results = {} } = {}) => {
        gateway = installPrintingGateway({ ...data, property: withFdLanguage(data.property, lang), labels, results: { "/Get_Booking_Invoice_Info": invoice, "/Mark_Payment_As_Receipt_Issued": {}, ...results } });
        return renderPage(FiscalDocumentsPage, { mode, id: data.booking?.booking_nbr ?? "80347800505", ...MODES[mode], ...extra });
    };
    const textOf = async (...args) => visibleText(await html(...args));

    test.each(NON_LATIN_LANGS.flatMap((lang) => Object.keys(MODES).map((mode) => [mode, lang])))(
        "the %s document in %s shows only _FD_LABELS text and booking data",
        async (mode, lang) => {
            const data = printableBooking();
            const out = await html(data, mode, {}, { lang, labels: markedLabels("_FD_LABELS") });
            // Rooms without a unit are named by the start of their identifier.
            const shortIds = data.booking.rooms.map((r) => r.identifier.slice(0, 8));

            expect([untranslatedWords(out, [data, paymentSetupRows, invoiceFor(data.booking), shortIds]), rawLabelKeys(out)]).toEqual([[], []]);
        },
    );

    test("renders the labels in the language the gateway returns", async () => {
        const text = await textOf(printableBooking(), "invoice", {}, { lang: "fr", labels: labelsResult({ Lcz_Invoice: "Facture" }) });

        expect(text.startsWith("Facture")).toBe(true);
    });

    test.each(Object.keys(MODES))("the %s document is laid out right-to-left in Arabic", async (mode) => {
        expect(await html(printableBooking(), mode, {}, { lang: "ar" })).toContain('dir="rtl"');
    });

    describe("document language", () => {
        const render = (property, searchParams = {}, labels) => {
            const data = printableBooking();
            gateway = installPrintingGateway({ ...data, property: property(data.property), labels, results: { "/Get_Booking_Invoice_Info": invoiceFor(data.booking) } });
            return renderPage(FiscalDocumentsPage, { mode: "invoice", id: data.booking.booking_nbr, ...MODES.invoice, ...searchParams });
        };

        test("comes from the property's FD_LANGUAGE", async () => {
            await render((property) => withFdLanguage(property, "fr"));

            expect(labelRequests(gateway.requests)).toEqual([{ code: "fr", sections: ["_FD_LABELS"] }]);
        });

        test("ignores the lang search param", async () => {
            await render((property) => withFdLanguage(property, "fr"), { lang: "ar" });

            expect(labelRequests(gateway.requests)).toEqual([{ code: "fr", sections: ["_FD_LABELS"] }]);
        });

        test("loads the booking and countries in that language", async () => {
            await render((property) => withFdLanguage(property, "fr"));
            const languageOf = (endpoint) => gateway.requests.find((r) => r.endpoint === endpoint).body.language;

            expect([languageOf("/Get_Exposed_Booking"), languageOf("/Get_Exposed_Countries")]).toEqual(["fr", "fr"]);
        });

        test.each([
            ["no extra info", (property) => ({ ...property, extra_info: null })],
            ["no FD_LANGUAGE", (property) => ({ ...property, extra_info: [{ key: "OTHER", value: "fr" }] })],
            ["a blank FD_LANGUAGE", (property) => withFdLanguage(property, "")],
        ])("is English for a property with %s, whatever the search param says", async (_case, property) => {
            await render(property, { lang: "ar" });

            expect(labelRequests(gateway.requests)).toEqual([{ code: "en", sections: ["_FD_LABELS"] }]);
        });

        test("prints the property in that language", async () => {
            const data = printableBooking();
            const property = withFdLanguage({ ...data.property, city: { name: "Byblos" } }, "fr");
            const localized = { ...property, city: { name: "Jbeil" } };
            gateway = installPrintingGateway({ ...data, results: {
                "/Get_Booking_Invoice_Info": invoiceFor(data.booking),
                "/Get_Exposed_Property": (body) => (body.language === "fr" ? localized : property),
            } });

            const text = visibleText(await renderPage(FiscalDocumentsPage, { mode: "invoice", id: data.booking.booking_nbr, ...MODES.invoice }));

            expect([text.includes("Jbeil"), text.includes("Byblos")]).toEqual([true, false]);
        });

        test("an English property is loaded only once", async () => {
            await render((property) => withFdLanguage(property, "en"));

            expect(endpointsHit(gateway.requests).filter((e) => e === "/Get_Exposed_Property")).toHaveLength(1);
        });
    });

    describe("header", () => {
        test("names the invoicing company when it isn't the hotel's name", async () => {
            const data = printableBooking();
            data.property.name = "Demo Hotel";

            expect(await textOf(data, "invoice")).toContain("Demo Hotel SAL Ice Venue 11");
        });

        test("leaves out the company name when it is the hotel's name", async () => {
            const data = printableBooking();
            data.property.name = "Demo Hotel";
            data.property.company.name = " demo HOTEL ";

            const text = await textOf(data, "invoice");

            expect([text.match(/demo hotel/gi)?.length, text.includes("Ice Venue 11")]).toEqual([1, true]);
        });
    });

    describe("invoice", () => {
        test("is numbered and dated the day it was issued", async () => {
            expect(await textOf(printableBooking(), "invoice")).toStartWith("Invoice Invoice no.: INV-19 Date of issue: September 30, 2025 Booking #80347800505 Bill to Name: Test Test");
        });

        test("lists each night with its net price, VAT and total", async () => {
            expect(await textOf(printableBooking(), "invoice")).toContain("Sep 27, 2025 Standard Rooms – Bed & breakfast US$ 60.00 11% US$ 6.60 US$ 66.60");
        });

        test("totals the net price, VAT and amount due of everything invoiced", async () => {
            // Nights 60+60+140+140, pickup 35, spa 25, penalty 40 — VAT 11% on nights and spa.
            expect(await textOf(printableBooking(), "invoice")).toContain("US$ 500.00 Net price US$ 46.75 VAT US$ 546.75 Total due");
        });

        test("deducts a 009 discount it covers, even when the gateway sends it positive", async () => {
            const data = printableBooking();
            data.booking.financial.payments.push(payment(8, "009", 30));
            const invoice = invoiceFor(data.booking);
            invoice.invoices[0].items.push({ key: 8, type: "PAYMENT" });

            const text = await textOf(data, "invoice", {}, { invoice });

            expect([
                text.includes("Sep 20, 2025 Discount - US$ 30.00 — - US$ 30.00"),
                text.includes("US$ 470.00 Net price US$ 46.75 VAT US$ 516.75 Total due"),
            ]).toEqual([true, true]);
        });

        test("deducts a 012 cancellation adjustment while the 013 cancellation penalty stays a charge", async () => {
            const data = printableBooking();
            data.booking.financial.payments.push(payment(9, "012", 20));
            const invoice = invoiceFor(data.booking);
            invoice.invoices[0].items.push({ key: 9, type: "PAYMENT" });

            const text = await textOf(data, "invoice", {}, { invoice });

            expect([
                text.includes("Sep 20, 2025 Cancellation penalty US$ 40.00 — US$ 40.00"),
                text.includes("Sep 20, 2025 Cancellation adjustment - US$ 20.00 — - US$ 20.00"),
                text.includes("US$ 480.00 Net price US$ 46.75 VAT US$ 526.75 Total due"),
            ]).toEqual([true, true, true]);
        });

        test("leaves out a charge the invoice doesn't cover", async () => {
            const data = printableBooking();
            data.booking.financial.payments.push(payment(8, "009", 30));

            const text = await textOf(data, "invoice");

            expect([text.includes("Discount"), text.includes("US$ 546.75 Total due")]).toEqual([false, true]);
        });

        test("only lists what the invoice covers", async () => {
            const data = printableBooking();
            const invoice = invoiceFor(data.booking);
            invoice.invoices[0].items = invoice.invoices[0].items.filter((i) => i.key === 101);

            const text = await textOf(data, "invoice", {}, { invoice });

            expect([text.includes("Standard Rooms"), text.includes("Premium Suites"), text.includes("Spa access"), text.includes("Beirut airport")]).toEqual([true, false, false, false]);
        });

        test("shows the guest's balance and what was collected", async () => {
            expect(await textOf(printableBooking(), "invoice")).toContain("Balance summary Guest balance:US$ 294.00 Guest collected:US$ 150.00");
        });

        test("ends with the company's invoice notes", async () => {
            expect(await textOf(printableBooking(), "invoice")).toEndWith("Thank you for staying with us.");
        });

        test("an invoice number that doesn't exist says so instead of printing an empty invoice", async () => {
            expect(await textOf(printableBooking(), "invoice", { documentId: "INV-404" })).toBe("Missing document INV-404");
        });
    });

    describe("credit note", () => {
        test("refers to the invoice it credits", async () => {
            expect(await textOf(printableBooking(), "creditnote")).toStartWith("Credit note Credit note no.: CN-3 For original invoice no.: INV-19");
        });

        test("negates every amount of the invoice", async () => {
            expect(await textOf(printableBooking(), "creditnote")).toContain("- US$ 500.00 Net price - US$ 46.75 VAT - US$ 546.75 Total due");
        });

        test("shows how it changes the original invoice instead of the guest balance", async () => {
            const text = await textOf(printableBooking(), "creditnote");

            expect([text.includes("Effects on original invoice Original invoice total:US$ 444.00 Less: credit note:- US$ 444.00 Revised net amount:US$ 0.00"), text.includes("Balance summary")]).toEqual([true, false]);
        });
    });

    describe("receipt", () => {
        test("shows the amount received, its method and reference", async () => {
            expect(await textOf(printableBooking(), "receipt")).toContain("Amount received:US$ 150.00 Method:Credit card Reference:REF-5");
        });

        test("is numbered and dated with the payment", async () => {
            expect(await textOf(printableBooking(), "receipt")).toStartWith("Receipt Receipt no.: R-5 Date of issue: September 20, 2025");
        });

        test("a payment method with a blank translation is named in English", async () => {
            const blank = paymentSetupRows.map((r) => (r.CODE_NAME === "002" && r.TBL_NAME === "_PAY_METHOD" ? { ...r, CODE_VALUE_FR: "" } : r));
            const data = printableBooking();
            gateway = installPrintingGateway({ ...data, property: withFdLanguage(data.property, "fr"), results: { "/Get_Setup_Entries_By_TBL_NAME_Multi": blank } });

            const text = visibleText(await renderPage(FiscalDocumentsPage, { mode: "receipt", id: data.booking.booking_nbr, ...MODES.receipt }));

            expect(text).toContain("Method:Credit card");
        });

        test("names the payment method in the document's language", async () => {
            expect(await textOf(printableBooking(), "receipt", {}, { lang: "fr" })).toContain("Carte de crédit");
        });

        test("leaves the reference out when the payment has none", async () => {
            const data = printableBooking();
            data.booking.financial.payments[0].reference = null;

            expect(await textOf(data, "receipt")).not.toContain("Reference");
        });

        test("marks a payment's receipt as issued the first time it is printed", async () => {
            const data = printableBooking();
            data.booking.financial.payments[0].is_receipt_issued = false;

            await textOf(data, "receipt");

            expect(gateway.requests.filter((r) => r.endpoint === "/Mark_Payment_As_Receipt_Issued").map((r) => r.body)).toEqual([{ payment_id: "5", receipt_nbr: "R-5" }]);
        });

        describe("marking the payment", () => {
            const unissued = () => {
                const data = printableBooking();
                data.booking.financial.payments[0].is_receipt_issued = false;
                return data;
            };

            test("the receipt is only returned once its payment is marked", async () => {
                const marking = heldAnswer({});
                let returned = false;
                const rendering = html(unissued(), "receipt", {}, { results: { "/Mark_Payment_As_Receipt_Issued": marking.answer } }).then(() => {
                    returned = true;
                });
                await settle();
                await settle();
                const returnedBeforeMarked = returned;

                marking.release();
                await rendering;

                expect(returnedBeforeMarked).toBe(false);
            });

            test("the receipt still prints when marking it fails", async () => {
                const results = { "/Mark_Payment_As_Receipt_Issued": new Error("Marking service down") };

                expect(await textOf(unissued(), "receipt", {}, { results })).toContain("R-5");
            });
        });

        test("a payment that doesn't exist prints no payment", async () => {
            expect(await textOf(printableBooking(), "receipt", { pid: "999" })).not.toContain("Amount received");
        });
    });

    describe.each(["creditreceipt", "refund"])("%s", (mode) => {
        test("credits the refunded amount", async () => {
            expect(await textOf(printableBooking(), mode)).toContain("Credit receipt no.: CR-6 Date of issue: September 20, 2025");
        });

        test("lists the credit and its total", async () => {
            expect(await textOf(printableBooking(), mode)).toContain("Sep 20, 2025 Credit receipt - US$ 20.00 - US$ 20.00 Total credit");
        });

        test("a payment that doesn't exist says no payment was found", async () => {
            expect(await textOf(printableBooking(), mode, { pid: "999" })).toContain("No payment found for this credit receipt.");
        });
    });

    test("a credit receipt names the receipt it credits", async () => {
        const data = printableBooking();
        data.booking.financial.payments[0].credit_receipt_nbr = 6;

        expect(await textOf(data, "creditreceipt")).toContain("For original receipt no.: R-5");
    });

    describe("proforma", () => {
        test("lists everything on the booking when no items are picked", async () => {
            const text = await textOf(printableBooking(), "proforma");

            expect([text.includes("Standard Rooms"), text.includes("Premium Suites"), text.includes("Beirut airport"), text.includes("Spa access")]).toEqual([true, true, true, true]);
        });

        test("lists only the picked items", async () => {
            const text = await textOf(printableBooking(), "proforma", { ids: "101-801" });

            expect([text.includes("Standard Rooms"), text.includes("Premium Suites"), text.includes("Beirut airport"), text.includes("Spa access")]).toEqual([true, false, false, true]);
        });

        test("deducts discounts and cancellation adjustments and charges the cancellation penalty, whatever sign the gateway sends", async () => {
            const data = printableBooking();
            data.booking.financial.payments.push(payment(8, "009", -30), payment(9, "012", 20));

            const text = await textOf(data, "proforma");

            expect([
                text.includes("Discount - US$ 30.00"),
                text.includes("Cancellation adjustment - US$ 20.00"),
                text.includes("Cancellation penalty US$ 40.00"),
                text.includes("US$ 450.00 Net price US$ 46.75 VAT US$ 496.75 Total due"),
            ]).toEqual([true, true, true, true]);
        });

        test("lists only the picked charges", async () => {
            const data = printableBooking();
            data.booking.financial.payments.push(payment(8, "009", 30), payment(9, "012", 20));

            const text = await textOf(data, "proforma", { ids: "101-8" });

            expect([text.includes("Discount"), text.includes("Cancellation adjustment"), text.includes("Cancellation penalty")]).toEqual([true, false, false]);
        });

        test("is billed to the company when asked", async () => {
            const data = printableBooking();
            data.booking.company_name = "Acme Travel";

            expect(await textOf(data, "proforma", { bill_to: "company" })).toContain("Bill to Acme Travel");
        });

        test("is billed to a named person on behalf of the guest", async () => {
            expect(await textOf(printableBooking(), "proforma", { bill_to: "John Doe" })).toContain("Bill to John Doe for Test Test");
        });
    });

    test.each(Object.keys(MODES).filter((mode) => mode !== "printing"))("the %s document has no print button", async (mode) => {
        expect(await html(printableBooking(), mode)).not.toContain("<button");
    });

    describe("booking print", () => {
        test("for an agent's booking loads the agent's ledger while the localized property is still loading", async () => {
            const data = printableBooking();
            data.booking.agent = { id: 227 };
            const property = withFdLanguage(data.property, "fr");
            const localized = heldAnswer(property);
            gateway = installPrintingGateway({ ...data, results: {
                "/Get_Exposed_Property": (body) => (body.language === "fr" ? localized.answer() : property),
                "/Fetch_CL": { My_Cl_tx: [] },
            } });

            const rendering = renderPage(FiscalDocumentsPage, { mode: "printing", id: data.booking.booking_nbr });
            await settle();
            await settle();
            const ledgerRequested = gateway.requests.some((r) => r.endpoint === "/Fetch_CL");
            localized.release();
            await rendering;

            expect(ledgerRequested).toBe(true);
        });

        test("shows each night's rate under its day", async () => {
            expect(await textOf(printableBooking(), "printing")).toContain("27/09 Sa US$ 60.00 28/09 Su US$ 60.00");
        });

        test("shows when and through which channel the booking was made", async () => {
            expect(await textOf(printableBooking(), "printing")).toContain("Booking#80347800505 Direct | website Sep 18, 2025 04:03 PM");
        });

        test("shows the pickup with its arrival time", async () => {
            expect(await textOf(printableBooking(), "printing")).toContain("PICKUP Yes, from Beirut airport Arrival date: Sep 27, 2025 Arrival Time: 04:03 PM Flight details: ME 211");
        });

        test("offers a button to print it", async () => {
            expect(visibleText((await html(printableBooking(), "printing")).match(/<button[\s\S]*?<\/button>/)?.[0] ?? "")).toBe("Print");
        });

        test("lists the guest's payments in the guest folio", async () => {
            expect(await textOf(printableBooking(), "printing")).toContain("Guest folio Date Amount Designation Ref Sep 20, 2025 US$ 150.00 Payment: Credit card REF-5");
        });

        test("with strip_prices=true a booking with no agent shows no amount, but still lists what was booked", async () => {
            const text = await textOf(printableBooking(), "printing", { strip_prices: "true" });

            expect([text.includes("US$"), text.includes("Standard Rooms"), text.includes("Premium Suites"), text.includes("Sedan"), text.includes("Spa access")])
                .toEqual([false, true, true, true, true]);
        });
    });

    test.each([
        ["no token", { token: "" }],
        ["an unknown mode", { mode: "statement" }],
        ["no booking number", { id: "" }],
    ])("a request with %s shows an error instead of a document", async (_case, params) => {
        const data = printableBooking();
        gateway = installPrintingGateway(data);

        const text = visibleText(await renderPage(FiscalDocumentsPage, { mode: "invoice", id: "80347800505", ...params }));

        expect(text).toBe("Something went wrong. Please try again.");
    });

    describe("print log", () => {
        let log;
        beforeEach(() => {
            log = capturePrintLog();
        });
        afterEach(() => log.restore());

        test("a printed document is logged once, naming what was printed", async () => {
            await html(printableBooking(), "invoice");

            expect(log.entries()).toEqual([
                expect.objectContaining({ level: "info", message: "print succeeded", route: "fd", mode: "invoice", property: "a35", booking: "80347800505", document: "INV-19" }),
            ]);
        });

        test("in production a printed document still renders and writes no line", async () => {
            process.env.APP_ENV = "production";

            const text = await textOf(printableBooking(), "invoice");

            expect([text.includes("INV-19"), log.entries()]).toEqual([true, []]);
        });

        test("a gateway failure is logged with its cause, and not as a success", async () => {
            await html(printableBooking(), "invoice", {}, { results: { "/Get_Exposed_Booking": new Error("Booking service down") } });

            expect(log.entries()).toEqual([
                expect.objectContaining({
                    level: "error",
                    message: "print failed",
                    route: "fd",
                    booking: "80347800505",
                    error: expect.objectContaining({ name: "ApiError", message: "Booking service down", stack: expect.stringContaining("api.service.js") }),
                }),
            ]);
        });

        test("the logged url is the real link, with its token", async () => {
            await html(printableBooking(), "invoice", { token: "secret-token" });

            const { url } = log.entries()[0];
            expect([url.startsWith("https://a35.bookingmystay.com/a35/printing/fd?"), url.includes("token=secret-token")]).toEqual([true, true]);
        });

        test("a token the gateway echoes in its error is cut out of the logged error", async () => {
            const rejected = new Error("secret-token   :  JWT.Exceptions.InvalidTokenPartsException: Token must consist of 3 delimited by dot parts.");

            await html(printableBooking(), "invoice", { token: "secret-token" }, { results: { "/Get_Exposed_Booking": rejected } });

            expect(JSON.stringify(log.entries()[0].error)).not.toContain("secret-token");
        });

        test.each([
            ["no token", { token: "" }, "missing token"],
            ["no mode", { mode: "" }, "missing mode"],
            ["an unknown mode", { mode: "statement" }, "unknown mode"],
            ["no booking number", { id: "" }, "missing booking"],
        ])("a link with %s is logged as a warning, not as a failure", async (_case, params, reason) => {
            gateway = installPrintingGateway(printableBooking());

            await renderPage(FiscalDocumentsPage, { mode: "invoice", id: "80347800505", ...params });

            expect(log.entries()).toEqual([expect.objectContaining({ level: "warn", message: "print rejected", route: "fd", reason })]);
        });

        test("a booking that doesn't exist is logged as a warning, not as a failure", async () => {
            await html({ booking: null, property: printableBooking().property }, "invoice", {}, { invoice: null }).catch(() => {});

            expect(log.entries()).toEqual([expect.objectContaining({ level: "warn", message: "print rejected", reason: "booking not found" })]);
        });

        test("a crash while preparing the document is logged and still reaches Next", async () => {
            const crash = await html(printableBooking(), "proforma", { ids: ["1", "2"] }).catch((e) => e);

            expect([crash.name, log.entries()]).toEqual([
                "TypeError",
                [expect.objectContaining({ level: "error", message: "print failed", error: expect.objectContaining({ name: "TypeError" }) })],
            ]);
        });
    });

    describe("bed preferences", () => {
        const fiscalModes = Object.keys(MODES).filter((mode) => mode !== "printing");

        test.each(fiscalModes)("the %s document still prints when they can't be loaded", async (mode) => {
            const results = { "/Get_Setup_Entries_By_TBL_NAME": new Error("Setup service down") };

            expect(await textOf(printableBooking(), mode, {}, { results })).not.toBe("Something went wrong. Please try again.");
        });

        test("the booking print names each room's bed preference", async () => {
            const data = printableBooking();
            data.booking.rooms[0].bed_preference = 7;
            const results = { "/Get_Setup_Entries_By_TBL_NAME": [{ CODE_NAME: "7", CODE_VALUE_EN: "Twin beds" }] };

            expect(await textOf(data, "printing", {}, { results })).toContain("Twin beds");
        });
    });

    test("when the gateway fails it shows an error instead of a document", async () => {
        const data = printableBooking();

        expect(await textOf(data, "invoice", {}, { invoice: new Error("Invoice service down") })).toBe("Something went wrong. Please try again.");
    });

    test("a booking that doesn't exist sends the user back to the booking list", async () => {
        const error = await html({ booking: null, property: printableBooking().property }, "invoice", {}, { invoice: null }).catch((e) => e);

        expect(error.digest).toContain("https://x.igloorooms.com/manage/acbookinglist.aspx");
    });
});

// The least a page needs to load; enough to see which gateway each request goes to.
const bareBooking = { booking_nbr: "74046077780", rooms: [], financial: { payments: [] } };

describe("gateway environment", () => {
    let gateway;
    beforeEach(() => {
        gateway = installFakeGateway({ "/Get_Exposed_Booking": bareBooking, "/Get_Exposed_Countries": [] });
    });
    afterEach(() => gateway.restore());

    test("environment=alpha sends every request to IRALPHA", async () => {
        await FiscalDocumentsPage({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "invoice", id: bareBooking.booking_nbr, token: "token", environment: "alpha" },
        });

        expect(gateway.requests.length).toBeGreaterThan(0);
        expect(gatewaysHit(gateway.requests)).toEqual([IRALPHA]);
    });

    test("environment=alpha marks the printed receipt as issued on IRALPHA", async () => {
        gateway.restore();
        gateway = installFakeGateway({
            "/Get_Exposed_Booking": { ...bareBooking, financial: { payments: [{ system_id: 5, is_receipt_issued: false }] } },
            "/Get_Exposed_Countries": [],
        });

        await FiscalDocumentsPage({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "receipt", id: bareBooking.booking_nbr, pid: "5", documentId: "R-1", token: "token", environment: "alpha" },
        });

        expect(endpointsHit(gateway.requests)).toContain("/Mark_Payment_As_Receipt_Issued");
        expect(gatewaysHit(gateway.requests)).toEqual([IRALPHA]);
    });

    test("environment=alpha loads the booking's city ledger from IRALPHA in printing mode", async () => {
        gateway.restore();
        gateway = installFakeGateway({
            "/Get_Exposed_Booking": { ...bareBooking, agent: { id: 227 } },
            "/Get_Exposed_Countries": [],
        });

        await FiscalDocumentsPage({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "printing", id: bareBooking.booking_nbr, token: "token", environment: "alpha" },
        });

        expect(endpointsHit(gateway.requests)).toContain("/Fetch_CL");
        expect(gatewaysHit(gateway.requests)).toEqual([IRALPHA]);
    });

    test("without environment every request stays on IR", async () => {
        await FiscalDocumentsPage({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "invoice", id: bareBooking.booking_nbr, token: "token" },
        });

        expect(gatewaysHit(gateway.requests)).toEqual([IR]);
    });
});
