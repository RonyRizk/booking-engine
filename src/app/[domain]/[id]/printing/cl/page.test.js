import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import CityLedgerPrintingPages from "./page";
import { printableBooking, withFdLanguage } from "@/test/fixtures/printing";
import { agent, fiscalDocuments, installCityLedgerGateway, invoiceTransactions, paymentMethods, paymentTransaction, renderCityLedger } from "@/test/fixtures/city-ledger";
import { endpointsHit, gatewaysHit, heldAnswer, installFakeGateway, IRALPHA, labelRequests, settle } from "@/test/helpers/fake-gateway";
import { visibleText } from "@/test/helpers/render";
import { labelsResult, markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";
import { capturePrintLog } from "@/test/helpers/print-log";

const PERIOD = { from: "2026-01-01", to: "2026-01-31" };
const MODES = {
    invoice: { docNo: "INV-19" },
    draft: { docNo: "INV-19" },
    receipt: { docNo: "REC-4" },
    creditnote: { docNo: "CN-2" },
    creditreceipt: { docNo: "CREC-1" },
    debitnote: { docNo: "DN-1" },
    statement: PERIOD,
    proforma: PERIOD,
};

describe("city ledger page", () => {
    let env;
    afterEach(() => env?.gateway.restore());

    const html = (mode, extra = {}, gatewayOptions = {}) => {
        env = installCityLedgerGateway(gatewayOptions);
        return renderCityLedger(CityLedgerPrintingPages, { mode, ...MODES[mode], ...extra });
    };
    const textOf = async (...args) => visibleText(await html(...args));

    test.each(NON_LATIN_LANGS.flatMap((lang) => Object.keys(MODES).map((mode) => [mode, lang])))(
        "the %s document in %s shows only _FD_LABELS text and ledger data",
        async (mode, lang) => {
            const out = await html(mode, {}, { lang, labels: markedLabels("_FD_LABELS") });
            // Type names are left out: they are what the document must translate.
            const documents = fiscalDocuments().map(({ FD_TYPE_NAME, ...doc }) => doc);
            const data = [env.property, agent(), "France", invoiceTransactions(), paymentTransaction(), paymentMethods, documents, "Wellness", "Spa access"];

            expect([untranslatedWords(out, data), rawLabelKeys(out)]).toEqual([[], []]);
        },
    );

    test("renders the labels in the language the gateway returns", async () => {
        expect(await textOf("invoice", {}, { lang: "fr", labels: labelsResult({ Lcz_Invoice: "Facture" }) })).toStartWith("Facture");
    });

    describe("print log", () => {
        let log;
        beforeEach(() => {
            log = capturePrintLog();
        });
        afterEach(() => log.restore());

        test("a printed document is logged once, naming what was printed", async () => {
            await html("invoice");

            expect(log.entries()).toEqual([
                expect.objectContaining({ level: "info", message: "print succeeded", route: "cl", mode: "invoice", property: "a35", agent: "227", document: "INV-19" }),
            ]);
        });

        test("a statement is logged with its period, which is what identifies it", async () => {
            await html("statement");

            expect(log.entries()).toEqual([expect.objectContaining({ mode: "statement", from: "2026-01-01", to: "2026-01-31" })]);
        });

        test("a gateway failure is logged with its cause, and not as a success", async () => {
            await html("invoice", {}, { results: { "/Fetch_CL": new Error("Ledger service down") } });

            expect(log.entries()).toEqual([
                expect.objectContaining({ level: "error", message: "print failed", route: "cl", error: expect.objectContaining({ message: "Ledger service down" }) }),
            ]);
        });

        test.each([
            ["no token", { token: "" }, "missing token"],
            ["no mode", { mode: "" }, "missing mode"],
            ["an unknown mode", { mode: "printing" }, "unknown mode"],
            ["no agent", { aid: "" }, "missing agent"],
        ])("a link with %s is logged as a warning before sending the user away", async (_case, params, reason) => {
            await html("invoice", params).catch(() => {});

            expect(log.entries()).toEqual([expect.objectContaining({ level: "warn", message: "print rejected", route: "cl", reason })]);
        });
    });

    test.each(Object.keys(MODES))("the %s document is laid out right-to-left in Arabic", async (mode) => {
        expect(await html(mode, {}, { lang: "ar" })).toContain('dir="rtl"');
    });

    describe("document language", () => {
        test("comes from the property's FD_LANGUAGE", async () => {
            await html("invoice", {}, { lang: "fr" });

            expect(labelRequests(env.gateway.requests)).toEqual([{ code: "fr", sections: ["_FD_LABELS"] }]);
        });

        test("ignores the lang search param", async () => {
            await html("invoice", { lang: "ar" }, { lang: "fr" });

            expect(labelRequests(env.gateway.requests)).toEqual([{ code: "fr", sections: ["_FD_LABELS"] }]);
        });

        test("loads a proforma's booking and the countries in that language", async () => {
            await html("proforma", { id: "80347800505" }, { lang: "fr" });
            const languageOf = (endpoint) => env.gateway.requests.find((r) => r.endpoint === endpoint).body.language;

            expect([languageOf("/Get_Exposed_Booking"), languageOf("/Get_Exposed_Countries")]).toEqual(["fr", "fr"]);
        });

        test("is English for a property without FD_LANGUAGE, whatever the search param says", async () => {
            const { extra_info, ...property } = printableBooking().property;
            await html("invoice", { lang: "ar" }, { results: { "/Get_Exposed_Property": property } });

            expect(labelRequests(env.gateway.requests)).toEqual([{ code: "en", sections: ["_FD_LABELS"] }]);
        });

        test("prints the property in that language", async () => {
            const name = (city) => ({ ...withFdLanguage(printableBooking().property, "fr"), city: { name: city } });
            const text = await textOf("invoice", {}, { lang: "fr", results: { "/Get_Exposed_Property": (body) => name(body.language === "fr" ? "Jbeil" : "Byblos") } });

            expect([text.includes("Jbeil"), text.includes("Byblos")]).toEqual([true, false]);
        });

        test("an English property is loaded only once", async () => {
            await html("invoice", {}, { lang: "en" });

            expect(endpointsHit(env.gateway.requests).filter((e) => e === "/Get_Exposed_Property")).toHaveLength(1);
        });
    });

    test("every document is billed to the agent", async () => {
        expect(await textOf("invoice")).toContain("Bill to Acme Travel AC-55 Paris, France");
    });

    describe("invoice", () => {
        test("lists every night and service of the invoice with its VAT", async () => {
            const text = await textOf("invoice");

            expect([
                text.includes("Jan 05, 2026 Deluxe Room US$ 100.00 11% US$ 11.00 US$ 111.00"),
                text.includes("Jan 06, 2026 Wellness: Spa access US$ 30.00 11% US$ 3.30 US$ 33.30"),
            ]).toEqual([true, true]);
        });

        test("totals the net price, taxes and grand total", async () => {
            expect(await textOf("invoice")).toContain("US$ 230.00 Net price US$ 25.30 Taxes US$ 255.30 Grand total");
        });

        test("with collapse_units prints each unit's nights as one summed row", async () => {
            expect(await textOf("invoice", { collapse_units: "true" })).toContain("Jan 05, 2026 – Jan 07, 2026 Deluxe Room US$ 200.00 11% US$ 22.00 US$ 222.00");
        });

        test("names services by their category in the document's language", async () => {
            expect(await textOf("invoice", {}, { lang: "fr" })).toContain("Bien-être: Spa access");
        });

        test("ends with the company's invoice notes", async () => {
            expect(await textOf("invoice")).toEndWith("Thank you for staying with us.");
        });
    });

    describe("draft", () => {
        test("is titled as a draft invoice", async () => {
            expect(await textOf("draft")).toStartWith("Invoice draft");
        });

        test("has no invoice notes", async () => {
            expect(await textOf("draft")).not.toContain("Thank you for staying with us.");
        });
    });

    describe("receipt", () => {
        test("shows the payment and how it moved the agent's balance", async () => {
            expect(await textOf("receipt")).toContain(
                "Payment details Amount received:US$ 300.00 Payment method:Cash Reference:Wire 4471 Balance summary (account) Balance before payment:US$ 355.30 Payment received:US$ 300.00 Balance after payment:US$ 55.30",
            );
        });

        test("names the payment method in the document's language", async () => {
            expect(await textOf("receipt", {}, { lang: "fr" })).toContain("Espèces");
        });

        test("a receipt that doesn't exist says so instead of printing a blank page", async () => {
            expect(await textOf("receipt", { docNo: "REC-404" })).toBe("Missing document REC-404");
        });
    });

    describe("credit note", () => {
        test("refers to the invoice it credits", async () => {
            expect(await textOf("creditnote")).toStartWith("Credit note Credit note no.: CN-2 For original invoice no.: INV-19");
        });

        test("negates the credited amounts", async () => {
            expect(await textOf("creditnote")).toContain("- US$ 45.00 Net price - US$ 5.00 Taxes - US$ 50.00 Total credit");
        });

        test("dates and names the credit in the document's language", async () => {
            const text = await textOf("creditnote", {}, { lang: "fr", labels: labelsResult({ Lcz_CreditNote: "Avoir" }) });

            expect(text).toContain("12 janv. 2026 Avoir");
        });

        test("a credit note that doesn't exist says no data was found", async () => {
            expect(await textOf("creditnote", { docNo: "CN-404" })).toContain("No credit note data found.");
        });
    });

    test("a credit receipt refers to the receipt it credits and has no VAT columns", async () => {
        const text = await textOf("creditreceipt");

        expect([text.startsWith("Credit receipt Credit receipt no.: CREC-1 For original receipt no.: REC-4"), text.includes("Net price")]).toEqual([true, false]);
    });

    test("a debit note refers to the invoice it adds to", async () => {
        expect(await textOf("debitnote")).toStartWith("Debit note Debit note no.: DN-1 For original invoice no.: INV-19");
    });

    describe("statement", () => {
        test("runs the agent's balance from the opening to the closing balance", async () => {
            const text = await textOf("statement");

            expect([
                text.includes("Opening balance — Jan 01, 2026 US$ 100.00"),
                text.includes("Jan 08, 2026 INV-19 Invoice US$ 255.30 — US$ 355.30"),
                text.includes("Jan 10, 2026 REC-4 Receipt — US$ 300.00 US$ 55.30"),
                text.includes("Closing balance — Jan 31, 2026 US$ 35.30"),
            ]).toEqual([true, true, true, true]);
        });

        test("names each document type in the document's language", async () => {
            const labels = labelsResult({ Lcz_Invoice: "Facture", Lcz_Receipt: "Reçu" });

            const text = await textOf("statement", {}, { lang: "fr", labels });

            expect([text.includes("INV-19 Facture"), text.includes("REC-4 Reçu")]).toEqual([true, true]);
        });

        test("says when the period has no fiscal documents", async () => {
            expect(await textOf("statement", {}, { documents: [] })).toContain("No fiscal documents found for this period.");
        });

        test("says when there is no statement for the period", async () => {
            expect(await textOf("statement", {}, { statement: null })).toBe("No statement data found.");
        });
    });

    describe("proforma", () => {
        const agentService = (category) => (booking) => {
            booking.extra_services[0].agent = { id: 227 };
            booking.extra_services[0].category = { code: category };
        };
        const forBooking = { id: "80347800505", from: undefined, to: undefined };

        test("for a booking names the agent's services by category in the document's language", async () => {
            expect(await textOf("proforma", forBooking, { lang: "fr", editBooking: agentService("001") })).toContain("Bien-être: Spa access");
        });

        test("for a booking names a service of an unknown category by its description alone", async () => {
            const text = await textOf("proforma", forBooking, { editBooking: agentService("999") });

            expect([text.includes("Spa access"), text.includes("undefined")]).toEqual([true, false]);
        });

        test("for a period lists the agent's charges but not their payments", async () => {
            const text = await textOf("proforma");

            expect([text.startsWith("Proforma invoice"), text.includes("Deluxe Room"), text.includes("Wire 4471")]).toEqual([true, true, false]);
        });

        test("for a booking lists only the rooms sold through the agent", async () => {
            const editBooking = (booking) => {
                booking.rooms[0].agent = { id: 227 };
                booking.rooms[1].agent = { id: 999 };
            };

            const text = await textOf("proforma", { id: "80347800505", from: undefined, to: undefined }, { editBooking });

            expect([text.includes("Standard Rooms"), text.includes("Premium Suites")]).toEqual([true, false]);
        });
    });

    test.each(["invoice", "receipt", "creditnote", "debitnote", "proforma"])("the %s document starts loading while the property is still loading", async (mode) => {
        const property = heldAnswer({ ...printableBooking().property, currency: { id: 4, code: "USD", symbol: "US$" } });
        const rendering = html(mode, {}, { results: { "/Get_Exposed_Property": property.answer } });
        await settle();
        const documentRequested = env.gateway.requests.some((r) => ["/Fetch_CL", "/Get_Fiscal_Documents"].includes(r.endpoint));

        property.release();
        await rendering;

        expect(documentRequested).toBe(true);
    });

    test.each([
        ["a booking's proforma", "proforma", { id: "80347800505", from: undefined, to: undefined }, "/Fetch_CL"],
        ["a statement", "statement", {}, "/Get_Fiscal_Documents"],
    ])("%s starts on what doesn't need the property while the property is still loading", async (_case, mode, extra, endpoint) => {
        const property = heldAnswer({ ...printableBooking().property, currency: { id: 4, code: "USD", symbol: "US$" } });
        const rendering = html(mode, extra, { results: { "/Get_Exposed_Property": property.answer } });
        await settle();
        const requested = endpointsHit(env.gateway.requests).includes(endpoint);

        property.release();
        await rendering;

        expect(requested).toBe(true);
    });

    test.each([
        ["no token", { token: "" }],
        ["no agent", { aid: "" }],
        ["an unknown mode", { mode: "folio" }],
    ])("a request with %s sends the user back to the booking list", async (_case, params) => {
        const error = await html("invoice", params).catch((e) => e);

        expect(error.digest).toContain("https://x.igloorooms.com/manage/acbookinglist.aspx");
    });

    test.each([
        ["the property", { "/Get_Exposed_Property": new Error("Property service down") }],
        ["the document", { "/Fetch_CL": new Error("Ledger service down") }],
    ])("when loading %s fails it shows a translated error, not the raw error", async (_case, results) => {
        expect(await textOf("invoice", {}, { results })).toBe("Something went wrong. Please try again.");
    });
});

// The least a page needs to load; enough to see which gateway each request goes to.
const bareBooking = { booking_nbr: "74046077780", rooms: [], financial: { payments: [] } };

describe("gateway environment", () => {
    let gateway;
    beforeEach(() => {
        gateway = installFakeGateway({ "/Get_Exposed_Countries": [] });
    });
    afterEach(() => gateway.restore());

    test("environment=alpha sends every request to IRALPHA", async () => {
        await CityLedgerPrintingPages({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "invoice", aid: "227", docNo: "INV-19", token: "token", environment: "alpha" },
        });

        expect(endpointsHit(gateway.requests)).toContain("/Get_Setup_Entries_By_TBL_NAME_Multi");
        expect(gatewaysHit(gateway.requests)).toEqual([IRALPHA]);
    });

    test("environment=alpha loads the proforma's booking from IRALPHA", async () => {
        gateway.restore();
        gateway = installFakeGateway({ "/Get_Exposed_Countries": [], "/Get_Exposed_Booking": bareBooking });

        await CityLedgerPrintingPages({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "proforma", aid: "227", id: bareBooking.booking_nbr, token: "token", environment: "alpha" },
        });

        expect(endpointsHit(gateway.requests)).toContain("/Get_Exposed_Booking");
        expect(gatewaysHit(gateway.requests)).toEqual([IRALPHA]);
    });
});
