import { afterEach, describe, expect, test } from "bun:test";
import { GET } from "./route";
import { cancelledBooking, directBooking, otaBooking } from "@/test/fixtures/bookings";
import { emailRequest, installEmailGateway } from "@/test/fixtures/email";
import { visibleText } from "@/test/helpers/render";
import { labelsResult, markedLabels, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";

const query = (booking, lang = "ar") => ({ id: booking?.booking_nbr ?? "80347800505", aname: "a35", lang });

describe("booking confirmation email", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    // Non-Latin scripts, so any English left over (a label, a month name) stands out.
    test.each(["ar", "he", "ru", "ua", "el"])("in %s renders every word from _EMAIL_LABELS or the booking", async (lang) => {
        const data = directBooking();
        gateway = installEmailGateway({ ...data, labels: markedLabels("_EMAIL_LABELS") });

        const html = await (await GET(emailRequest("booking", query(data.booking, lang)))).text();

        expect([untranslatedWords(html, [data]), rawLabelKeys(html)]).toEqual([[], []]);
    });

    // The fixture checks in on Saturday 27 September 2025.
    test.each([
        ["ua", "27 вер 2025"],
        ["he", "27 ספט׳ 2025"],
        ["ru", "27 сент. 2025"],
        ["fr", "27 sept. 2025"],
        ["en", "Sat, 27 Sep 2025"],
    ])("in %s the check-in date reads %p", async (lang, date) => {
        const data = directBooking();
        gateway = installEmailGateway(data);

        const html = await (await GET(emailRequest("booking", query(data.booking, lang)))).text();

        expect(visibleText(html)).toContain(date);
    });

    const send = async (data, lang = "en", labels) => {
        gateway = installEmailGateway({ ...data, labels });
        const response = await GET(emailRequest("booking", query(data.booking, lang)));
        return { status: response.status, html: await response.text() };
    };
    const textOf = async (data, lang, labels) => visibleText((await send(data, lang, labels)).html);
    const withPaymentCode = (data, code) => {
        data.booking.extras = [{ key: "payment_code", value: code }];
        return data;
    };

    test("renders the labels in the language the gateway returns", async () => {
        const text = await textOf(directBooking(), "fr", labelsResult({ Lcz_Booking_details: "Détails de la réservation" }));

        expect(text).toContain("Détails de la réservation");
    });

    test("an Arabic email is laid out right-to-left", async () => {
        const { html } = await send(directBooking(), "ar");

        expect(html).toMatch(/<html[^>]*dir="rtl"/);
    });

    test("an English email is laid out left-to-right", async () => {
        const { html } = await send(directBooking(), "en");

        expect(html).toMatch(/<html[^>]*dir="ltr"/);
    });

    test("a direct booking is titled with its booking number", async () => {
        const data = directBooking();

        expect(await textOf(data)).toContain(`Booking reference ${data.booking.booking_nbr}`);
    });

    test("a channel booking is titled with the channel's booking number", async () => {
        expect(await textOf(otaBooking())).toContain("Booking reference BDC-5706402033");
    });

    test("a channel booking shows when it was booked instead of the guest's phone and stay times", async () => {
        const text = await textOf(otaBooking());

        expect([text.includes("Booked on"), text.includes("Check-in:")]).toEqual([true, false]);
    });

    test("a cancelled booking is titled as a cancellation and hides the property contact block", async () => {
        const data = cancelledBooking();
        const text = await textOf(data);

        expect([text.includes(`Cancellation for booking ${data.booking.booking_nbr}`), text.includes("Map it")]).toEqual([true, false]);
    });

    test("a booking the guest asked to cancel is flagged at the top", async () => {
        const data = directBooking();
        data.booking.is_requested_to_cancel = true;

        expect(await textOf(data)).toContain("Request email cancellation");
    });

    test("a confirmed booking says it is guaranteed", async () => {
        expect(await textOf(directBooking())).toContain("Your booking is guaranteed.");
    });

    test("a pending booking at an on-request property says it is not guaranteed yet", async () => {
        const data = directBooking();
        data.property.is_upon_request = true;
        data.booking.status = { code: "001", description: "Pending" };

        expect(await textOf(data)).toContain("Your booking request will shortly be processed by the property");
    });

    test("a booking the guest already paid towards shows what was paid and what is due", async () => {
        const data = directBooking();
        data.booking.guest_financial = { collected: 150, due_amount: 294 };

        const text = await textOf(data);

        expect([text.includes("Paid: US$ 150.00"), text.includes("Due: US$ 294.00")]).toEqual([true, true]);
    });

    test("an unpaid booking guaranteed by an offline card explains the pre-payment policy", async () => {
        expect(await textOf(withPaymentCode(directBooking(), "001"))).toContain("Payment might be requested according to the property's pre-payment policy");
    });

    test("an unpaid booking with no payment method says the balance is taken on arrival", async () => {
        expect(await textOf(directBooking())).toContain("The balance will be taken upon your arrival.");
    });

    test("an unpaid bank-transfer booking shows the property's instructions in the email's language", async () => {
        const data = withPaymentCode(directBooking(), "005");
        const method = data.property.allowed_payment_methods.find((m) => m.code === "005");
        const french = method.localizables.find((l) => l.language.code === "FR");
        french.description = "<p>Virement sur le compte 123</p>";

        expect(await textOf(data, "fr")).toContain("Virement sur le compte 123");
    });

    test("bank-transfer instructions fall back to English when the property has none in the email's language", async () => {
        const data = withPaymentCode(directBooking(), "005");
        const method = data.property.allowed_payment_methods.find((m) => m.code === "005");
        method.localizables.find((l) => l.language.code === "EN").description = "<p>Transfer to account 123</p>";

        expect(await textOf(data, "he")).toContain("Transfer to account 123");
    });

    test("a booking that doesn't exist answers 404 instead of an email", async () => {
        const { status } = await send({ booking: null, property: directBooking().property });

        expect(status).toBe(404);
    });
});
