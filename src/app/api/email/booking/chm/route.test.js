import { afterEach, describe, expect, test } from "bun:test";
import { POST } from "./route";
import { otaBooking } from "@/test/fixtures/bookings";
import { emailRequest, installEmailGateway } from "@/test/fixtures/email";
import { visibleText } from "@/test/helpers/render";
import { markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";

const query = (booking, lang = "en") => ({ id: booking?.booking_nbr ?? "80347800505", aname: "a35", lang });
const channel = { ota_name: "Booking.com", ota_url: "https://admin.booking.com/res/1", booking_details_url: "https://x.igloorooms.com/b/1" };

describe("channel manager email", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    const send = async (data, body, lang = "en", labels) => {
        gateway = installEmailGateway({ ...data, labels });
        const response = await POST(emailRequest("booking/chm", query(data.booking, lang), { body }));
        return { status: response.status, html: await response.text() };
    };
    const textOf = async (data, body, lang, labels) => visibleText((await send(data, body, lang, labels)).html);

    test.each(NON_LATIN_LANGS)("in %s renders every word from _EMAIL_LABELS or the booking", async (lang) => {
        const data = otaBooking();
        const body = { ...channel, operation: "MODIFY" };
        const { html } = await send(data, body, lang, markedLabels("_EMAIL_LABELS"));

        expect([untranslatedWords(html, [data, body]), rawLabelKeys(html)]).toEqual([[], []]);
    });

    test.each([
        ["COMMIT", "New Reservation"],
        ["MODIFY", "Modification"],
        ["CANCEL", "Cancellation"],
    ])("a %s from the channel is titled %p with the channel's booking number", async (operation, title) => {
        expect(await textOf(otaBooking(), { ...channel, operation })).toContain(`${title} BDC-5706402033`);
    });

    test("names the channel the booking came from", async () => {
        expect(await textOf(otaBooking(), { ...channel, operation: "COMMIT" })).toContain("Channel name: Booking.com");
    });

    test("links to the booking in igloorooms and in the channel", async () => {
        const { html } = await send(otaBooking(), { ...channel, operation: "COMMIT" });

        expect([html.includes(channel.booking_details_url), html.includes(channel.ota_url)]).toEqual([true, true]);
    });

    test("leaves out the links it wasn't given", async () => {
        const text = await textOf(otaBooking(), { operation: "COMMIT" });

        expect([text.includes("View details"), text.includes("Open in channel")]).toEqual([false, false]);
    });

    test("shows the booking's total price even when the guest gave no arrival time", async () => {
        const data = otaBooking();
        data.booking.arrival = null;

        expect(await textOf(data, { ...channel, operation: "COMMIT" })).toContain("Total price:");
    });

    test("an unknown operation answers 400", async () => {
        expect((await send(otaBooking(), { operation: "DELETE" })).status).toBe(400);
    });
});
