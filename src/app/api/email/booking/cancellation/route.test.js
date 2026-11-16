import { afterEach, describe, expect, test } from "bun:test";
import { GET } from "./route";
import { cancelledBooking } from "@/test/fixtures/bookings";
import { emailRequest, installEmailGateway } from "@/test/fixtures/email";
import { visibleText } from "@/test/helpers/render";
import { markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";

const query = (booking, lang = "en") => ({ id: booking?.booking_nbr ?? "80347800505", aname: "a35", lang });

describe("cancellation email", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    const send = async (data, lang = "en", { labels, penalty } = {}) => {
        gateway = installEmailGateway({ ...data, labels, results: { "/Get_Penalty_Statement": penalty } });
        const response = await GET(emailRequest("booking/cancellation", query(data.booking, lang)));
        return { status: response.status, html: await response.text() };
    };

    test.each(NON_LATIN_LANGS)("in %s renders every word from _EMAIL_LABELS or the booking", async (lang) => {
        const data = cancelledBooking();
        const { html } = await send(data, lang, { labels: markedLabels("_EMAIL_LABELS"), penalty: "Pénalité : 50 US$" });

        expect([untranslatedWords(html, [data, "Pénalité : 50 US$"]), rawLabelKeys(html)]).toEqual([[], []]);
    });

    test("is titled as the cancellation of the booking", async () => {
        const data = cancelledBooking();

        expect(visibleText((await send(data)).html)).toContain(`Cancellation for booking ${data.booking.booking_nbr}`);
    });

    test("shows the cancellation penalty the property charges", async () => {
        const text = visibleText((await send(cancelledBooking(), "en", { penalty: "US$ 50.00 will be charged" })).html);

        expect(text).toContain("Cancellation Penalty US$ 50.00 will be charged");
    });

    test("leaves the penalty section out when there is no penalty", async () => {
        expect(visibleText((await send(cancelledBooking())).html)).not.toContain("Cancellation Penalty");
    });

    test("lists the cancelled stay under the cancellation details", async () => {
        expect(visibleText((await send(cancelledBooking())).html)).toContain("Cancellation Details");
    });

    test("prints the property phone without a missing country prefix", async () => {
        const data = cancelledBooking();
        data.property.country.phone_prefix = null;
        data.property.phone = "9968454545";

        const text = visibleText((await send(data)).html);

        expect([text.includes("9968454545"), text.includes("undefined"), text.includes("+-")]).toEqual([true, false, false]);
    });

    test("a booking that doesn't exist answers 404", async () => {
        expect((await send({ booking: null, property: cancelledBooking().property })).status).toBe(404);
    });
});
