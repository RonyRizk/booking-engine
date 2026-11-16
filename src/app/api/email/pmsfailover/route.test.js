import { afterEach, describe, expect, test } from "bun:test";
import { POST } from "./route";
import { directBooking } from "@/test/fixtures/bookings";
import { emailRequest, installEmailGateway } from "@/test/fixtures/email";
import { visibleText } from "@/test/helpers/render";
import { markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";

const query = (booking, lang = "en") => ({ id: booking?.booking_nbr ?? "80347800505", aname: "a35", lang });

describe("PMS failover email", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    const send = async (data, body, lang = "en", labels) => {
        gateway = installEmailGateway({ ...data, labels });
        const response = await POST(emailRequest("pmsfailover", query(data.booking, lang), { body }));
        return { status: response.status, html: await response.text() };
    };
    const textOf = async (...args) => visibleText((await send(...args)).html);

    test.each(NON_LATIN_LANGS)("in %s renders every word from _EMAIL_LABELS or the booking", async (lang) => {
        const data = directBooking();
        const body = { reason: "Timeout" };
        const { html } = await send(data, body, lang, markedLabels("_EMAIL_LABELS"));

        expect([untranslatedWords(html, [data, body]), rawLabelKeys(html)]).toEqual([[], []]);
    });

    test("names the booking the PMS failed to receive", async () => {
        const data = directBooking();

        expect(await textOf(data, { reason: "Timeout" })).toContain(`PMS delivery failure: Booking#${data.booking.booking_nbr}`);
    });

    test("quotes the PMS answer", async () => {
        expect(await textOf(directBooking(), { reason: "Room type 12 is not mapped" })).toContain("PMS Answer: Room type 12 is not mapped");
    });

    test("says it keeps retrying", async () => {
        expect(await textOf(directBooking(), { reason: "Timeout" })).toContain("We will keep retrying during the next 24 hours.");
    });

    test("shows the booking's total price even when the guest gave no arrival time", async () => {
        const data = directBooking();
        data.booking.arrival = null;

        expect(await textOf(data, { reason: "Timeout" })).toContain("Total price:");
    });

    test("a request without a reason answers 400", async () => {
        expect((await send(directBooking(), { reason: "" })).status).toBe(400);
    });
});
