import { afterEach, beforeEach, describe, expect, setSystemTime, test } from "bun:test";
import DocumentPage from "./page";
import { installPrintingGateway, paymentSetupRows, printableBooking, renderPage, withFdLanguage } from "@/test/fixtures/printing";
import { markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";
import { visibleText } from "@/test/helpers/render";
import { capturePrintLog } from "@/test/helpers/print-log";

const lebanon = { cities: null, code: "LB", currency: null, flag: null, gmt_offset: 0, id: 2, market_places: null, name: "Lebanon", phone_prefix: null };
const person = (id, first_name, last_name, dob, is_main, number, code, description) => ({
    address: null, alternative_email: null, cci: null, city: null, country: lebanon, country_id: null, country_phone_prefix: null,
    dob, email: null, first_name, id, id_info: { number, type: { code, description } }, is_main, last_name,
    mobile: null, mobile_without_prefix: null, nbr_confirmed_bookings: 0, notes: null, password: null, subscribe_to_news_letter: null,
});
/** A room's `sharing_persons`, as Get_Exposed_Booking returns them. */
const roomGuests = () => [
    person(276513, "clara", "xxx", "1980-12-12", true, "121212", "001", "Passport"),
    person(276518, "asdas", "asdas", "1975-12-12", false, "1asd12", "002", "ID"),
];

describe("consent document", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    /** The consent document for the booking's second room ("Premium Suites"), as HTML. */
    const consentHtml = (data = printableBooking(), extra = {}) => {
        gateway = installPrintingGateway(data);
        return renderPage(DocumentPage, {
            mode: "consent",
            id: data.booking.booking_nbr,
            room_identifier: data.booking.rooms[1].identifier,
            ...extra,
        });
    };
    const consentText = async (...args) => visibleText(await consentHtml(...args));

    /** A booking whose consent shows everything it can: guests, room extras and terms. */
    const fullConsent = () => {
        const data = printableBooking();
        data.booking.rooms[1].sharing_persons = roomGuests();
        data.booking.extra_services[0].room_identifier = data.booking.rooms[1].identifier;
        data.property.extra_info = [{ key: "REGISTRATION_CARD_TERMS_AND_CONDITIONS", value: "<p>I accept <strong>the house rules</strong>.</p>" }];
        return data;
    };

    test.each(NON_LATIN_LANGS)("in %s shows only _FD_LABELS text and booking data", async (lang) => {
        const data = fullConsent();
        gateway = installPrintingGateway({ ...data, property: withFdLanguage(data.property, lang), labels: markedLabels("_FD_LABELS") });
        const out = await renderPage(DocumentPage, { mode: "consent", id: data.booking.booking_nbr, room_identifier: data.booking.rooms[1].identifier });

        expect([untranslatedWords(out, [data, paymentSetupRows]), rawLabelKeys(out)]).toEqual([[], []]);
    });

    test("is laid out right-to-left in Arabic", async () => {
        const data = fullConsent();
        data.property = withFdLanguage(data.property, "ar");

        expect(await consentHtml(data)).toContain('dir="rtl"');
    });

    test("opens with the document's title as its heading, like the fiscal documents", async () => {
        const html = await consentHtml();

        expect([visibleText(html).startsWith("Registration Card "), /<h3[^>]*>Registration Card<\/h3>/.test(html)]).toEqual([true, true]);
    });

    test("offers a button to print it", async () => {
        expect(visibleText((await consentHtml()).match(/<button[\s\S]*?<\/button>/)?.[0] ?? "")).toBe("Print");
    });

    test("shows only the room named by room_identifier", async () => {
        const text = await consentText();

        expect([text.includes("Premium Suites"), text.includes("Standard Rooms")]).toEqual([true, false]);
    });

    test("leaves out the booking's totals, pickup, booking-wide extras and payments", async () => {
        const text = await consentText();
        const shown = ["Grand total", "Balance", "Collected", "PICKUP", "Spa access", "Card details", "Guest folio"].filter((part) => text.includes(part));

        expect(shown).toEqual([]);
    });

    test("has no accommodation header: the room starts right after the guest's details", async () => {
        const text = await consentText();

        expect([text.includes("ACCOMMODATION"), text.includes("Guest notes: Late check-in Confirmed Premium Suites")]).toEqual([false, true]);
    });

    test("keeps the extras booked for the room under it", async () => {
        const data = printableBooking();
        data.booking.extra_services[0].room_identifier = data.booking.rooms[1].identifier;

        expect(await consentText(data)).toContain("Extras Transfer: Spa access Sep 27, 2025 Sep 28, 2025 US$ 25.00VAT: 11%");
    });

    test("lists every guest sharing the room under its name, with the occupancy beside them, then the room's dates", async () => {
        const data = printableBooking();
        data.booking.rooms[1].sharing_persons = roomGuests();

        expect(await consentText(data)).toContain(
            "Premium Suites Half board Guests 1 adult " +
            "Name: clara xxx Lebanon Passport: 121212 Date of birth: Dec 12, 1980 " +
            "Name: asdas asdas Lebanon ID: 1asd12 Date of birth: Dec 12, 1975 " +
            "Sep 27, 2025 Sep 29, 2025 Cancellation:",
        );
    });

    test("doesn't repeat the main guest as the room's guest name", async () => {
        const data = printableBooking();
        data.booking.rooms[1].sharing_persons = roomGuests();

        expect(await consentText(data)).not.toContain("Guest name");
    });

    test("a room with no guests on record still names its guest", async () => {
        const data = printableBooking();
        data.booking.rooms[1].sharing_persons = [];

        expect(await consentText(data)).toContain("Premium Suites Half board Guest name: Khayou la Foufou Mannou Wahech 1 adult Sep 27, 2025 Sep 29, 2025");
    });

    test("shows the property's registration card terms, rendered as HTML, after the room", async () => {
        const data = printableBooking();
        data.property.extra_info = [{ key: "REGISTRATION_CARD_TERMS_AND_CONDITIONS", value: "<p>I accept <strong>the house rules</strong>.</p>" }];

        const html = await consentHtml(data);

        expect([html.includes("<strong>the house rules</strong>"), visibleText(html).includes("US$ 140.00 I accept the house rules. Date:")]).toEqual([true, true]);
    });

    describe("on the day it is printed", () => {
        beforeEach(() => setSystemTime(new Date(2026, 10, 12, 9, 30)));
        afterEach(() => setSystemTime());

        test("ends with today's date and a line for the guest's signature, followed only by the on-screen print button", async () => {
            expect(await consentText()).toEndWith("Date: November 12, 2026 Signature: Print");
        });
    });

    test("asks the gateway only for the setup table it prints, the service categories", async () => {
        await consentHtml(fullConsent());

        expect(gateway.requests.filter((r) => r.endpoint === "/Get_Setup_Entries_By_TBL_NAME_Multi").map((r) => r.body.TBL_NAMES)).toEqual([["_SVC_CATEGORY"]]);
    });

    describe("a bad link", () => {
        let log;
        beforeEach(() => {
            log = capturePrintLog();
        });
        afterEach(() => log.restore());

        test.each([
            ["no token", { token: "" }, "missing token"],
            ["no mode", { mode: "" }, "missing mode"],
            ["an unknown mode", { mode: "invoice" }, "unknown mode"],
            ["no booking number", { id: "" }, "missing booking"],
            ["no room identifier", { room_identifier: "" }, "missing room"],
            ["a room the booking doesn't have", { room_identifier: "not-a-room" }, "room not found"],
        ])("with %s shows an error instead of a document and is logged as a rejection", async (_case, params, reason) => {
            const text = await consentText(printableBooking(), params);

            expect([text, log.entries()]).toEqual([
                "Something went wrong. Please try again.",
                [expect.objectContaining({ level: "warn", message: "print rejected", route: "doc", reason })],
            ]);
        });

        test("for a booking that doesn't exist shows an error and is logged as a rejection", async () => {
            const data = printableBooking();
            gateway = installPrintingGateway({ booking: null, property: data.property });

            const text = visibleText(await renderPage(DocumentPage, { mode: "consent", id: "404", room_identifier: data.booking.rooms[1].identifier }));

            expect([text, log.entries()]).toEqual([
                "Something went wrong. Please try again.",
                [expect.objectContaining({ level: "warn", message: "print rejected", route: "doc", reason: "booking not found" })],
            ]);
        });
    });

    describe("print log", () => {
        let log;
        beforeEach(() => {
            log = capturePrintLog();
        });
        afterEach(() => log.restore());

        test("a printed consent is logged once, naming the booking and room", async () => {
            const data = printableBooking();
            await consentHtml(data);

            expect(log.entries()).toEqual([
                expect.objectContaining({
                    level: "info", message: "print succeeded", route: "doc", mode: "consent", property: "a35",
                    booking: "80347800505", document: data.booking.rooms[1].identifier,
                    url: expect.stringContaining("https://a35.bookingmystay.com/a35/printing/doc?"),
                }),
            ]);
        });

        test("a gateway failure shows an error and is logged with its cause", async () => {
            const data = printableBooking();
            gateway = installPrintingGateway({ ...data, results: { "/Get_Exposed_Booking": new Error("Booking service down") } });

            const text = visibleText(await renderPage(DocumentPage, { mode: "consent", id: data.booking.booking_nbr, room_identifier: data.booking.rooms[1].identifier }));

            expect([text, log.entries()]).toEqual([
                "Something went wrong. Please try again.",
                [expect.objectContaining({ level: "error", message: "print failed", route: "doc", error: expect.objectContaining({ message: "Booking service down" }) })],
            ]);
        });
    });
});
