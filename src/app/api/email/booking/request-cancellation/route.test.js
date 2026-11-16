import { afterEach, describe, expect, test } from "bun:test";
import { GET } from "./route";
import { directBooking } from "@/test/fixtures/bookings";
import { emailRequest, installEmailGateway } from "@/test/fixtures/email";
import { visibleText } from "@/test/helpers/render";
import { markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";

const query = (booking, lang = "en") => ({ id: booking?.booking_nbr ?? "80347800505", aname: "a35", lang });

describe("request-cancellation email", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    const send = async (data, lang = "en", labels) => {
        gateway = installEmailGateway({ ...data, labels });
        const response = await GET(emailRequest("booking/request-cancellation", query(data.booking, lang)));
        return { status: response.status, html: await response.text() };
    };

    test.each(NON_LATIN_LANGS)("in %s renders every word from _EMAIL_LABELS or the booking", async (lang) => {
        const data = directBooking();
        data.booking.is_requested_to_cancel = true;
        const { html } = await send(data, lang, markedLabels("_EMAIL_LABELS"));

        expect([untranslatedWords(html, [data]), rawLabelKeys(html)]).toEqual([[], []]);
    });

    test("flags that the guest asked to cancel the booking", async () => {
        const data = directBooking();
        data.booking.is_requested_to_cancel = true;

        expect(visibleText((await send(data)).html)).toContain("Request email cancellation");
    });

    test("a booking that doesn't exist answers 404", async () => {
        expect((await send({ booking: null, property: directBooking().property })).status).toBe(404);
    });
});
