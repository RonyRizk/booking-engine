import { afterEach, describe, expect, test } from "bun:test";
import { GET } from "./route";
import { directBooking } from "@/test/fixtures/bookings";
import { emailRequest, installEmailGateway } from "@/test/fixtures/email";
import { heldAnswer, settle } from "@/test/helpers/fake-gateway";
import { visibleText } from "@/test/helpers/render";
import { markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";

const row = (TBL_NAME, CODE_NAME, en, fr) => ({ TBL_NAME, CODE_NAME, CODE_VALUE_EN: en, CODE_VALUE_FR: fr });
// The property's auto-email texts, as Get_Setup_Entries_By_TBL_NAME_Multi returns them.
const setupRows = [
    row("_PRE_ARRIVAL_EMAIL", "ENTRY_01", "Dear [GUEST_NAME],", "Cher [GUEST_NAME],"),
    row("_PRE_ARRIVAL_EMAIL", "ENTRY_02", "[PROPERTY_NAME] awaits you in [DAYS] days.", "[PROPERTY_NAME] vous attend dans [DAYS] jours."),
    row("_PRE_ARRIVAL_EMAIL", "ENTRY_05", "Kind regards", "Cordialement"),
    row("_PRE_ARRIVAL_EMAIL", "ENTRY_06", "Your booking number is [BOOK_NBR].", "Votre numéro de réservation est [BOOK_NBR]."),
    row("_DURING_THE_STAY_EMAIL", "ENTRY_01", "Dear [GUEST_NAME],", "Cher [GUEST_NAME],"),
    row("_POST_DEPARTURE_EMAIL", "ENTRY_01", "Thank you [GUEST_NAME],", "Merci [GUEST_NAME],"),
];
// Templates are filled in, so compare the text around their [PLACEHOLDERS].
const setupTexts = setupRows.flatMap((r) => [r.CODE_VALUE_EN, r.CODE_VALUE_FR].flatMap((v) => v.split(/\[[A-Z_]+\]/)));
const accessCode = { ALLOW_ACCESS_CODE: "1", ACCESS_CODE_PREFIX: "#", ACCESS_CODE_SUFFIX: "*", ACCESS_CODE: "4" };
const acExtra = (body) => (accessCode[body.EXTRA_KEY] == null ? null : [{ EXTRA_VALUE: accessCode[body.EXTRA_KEY] }]);

const withExtraInfo = (data) => {
    data.property.extra_info = [
        { key: "EMAIL_PRE_ARRIVAL_DAYS_BEFORE_CHECK_IN", value: "3" },
        { key: "EMAIL_PRE_ARRIVAL_CUSTOM_MESSAGE", value: "<p>Parking is free.</p>" },
        { key: "EMAIL_DURING_THE_STAY_CUSTOM_MESSAGE", value: "<p>Breakfast is served until ten.</p>" },
        { key: "EMAIL_POST_DEPARTURE_CUSTOM_MESSAGE", value: "<p>Please leave us a review.</p>" },
    ];
    return data;
};

describe("automatic guest emails", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    const send = async (data, mode, lang = "en", { labels, ac = acExtra, query = {} } = {}) => {
        gateway = installEmailGateway({
            ...data,
            labels,
            results: { "/Get_Setup_Entries_By_TBL_NAME_Multi": setupRows, "/Get_Ac_extra": ac },
        });
        const response = await GET(emailRequest("booking/auto", { id: data.booking.booking_nbr, aname: "a35", lang, mode, ...query }));
        return { status: response.status, html: await response.text() };
    };
    const textOf = async (...args) => visibleText((await send(...args)).html);

    test.each(NON_LATIN_LANGS.flatMap((lang) => ["pre", "during", "post"].map((mode) => [mode, lang])))(
        "the %s email in %s renders every word from _EMAIL_LABELS, the property's texts or the booking",
        async (mode, lang) => {
            const data = withExtraInfo(directBooking());
            const { html } = await send(data, mode, lang, { labels: markedLabels("_EMAIL_LABELS") });

            expect([untranslatedWords(html, [data, setupTexts, accessCode]), rawLabelKeys(html)]).toEqual([[], []]);
        },
    );

    test.each(NON_LATIN_LANGS)("the due email in %s renders every word from _EMAIL_LABELS or the booking", async (lang) => {
        const data = directBooking();
        const { html } = await send(data, "due", lang, { labels: markedLabels("_EMAIL_LABELS"), query: { due_amount: "250.5" } });

        expect([untranslatedWords(html, [data]), rawLabelKeys(html)]).toEqual([[], []]);
    });

    test("the pre-arrival email greets the guest and counts down to arrival in the email's language", async () => {
        const data = withExtraInfo(directBooking());

        const text = await textOf(data, "pre", "fr");

        expect([text.includes("Cher Test Test,"), text.includes("igloorooms Demo Hotel vous attend dans 3 jours.")]).toEqual([true, true]);
    });

    test("the pre-arrival email shows the property's custom message and the booking number", async () => {
        const data = withExtraInfo(directBooking());

        const text = await textOf(data, "pre");

        expect([text.includes("Parking is free."), text.includes(`Your booking number is ${data.booking.booking_nbr}.`)]).toEqual([true, true]);
    });

    test("the pre-arrival email lists an access code per room, built from the booking number", async () => {
        const data = withExtraInfo(directBooking());

        const text = await textOf(data, "pre");

        expect([text.includes("Your access codes:"), text.match(/#0505\*/g)?.length]).toEqual([true, data.booking.rooms.length]);
    });

    test("the pre-arrival email uses the singular heading for a single room", async () => {
        const data = withExtraInfo(directBooking());
        data.booking.rooms = data.booking.rooms.slice(0, 1);

        expect(await textOf(data, "pre")).toContain("Your access code:");
    });

    test("the pre-arrival email leaves access codes out when the property doesn't allow them", async () => {
        const data = withExtraInfo(directBooking());
        const ac = (body) => (body.EXTRA_KEY === "ALLOW_ACCESS_CODE" ? [{ EXTRA_VALUE: "0" }] : acExtra(body));

        expect(await textOf(data, "pre", "en", { ac })).not.toContain("access code");
    });

    test("the during-the-stay email shows the property's message", async () => {
        expect(await textOf(withExtraInfo(directBooking()), "during")).toContain("Breakfast is served until ten.");
    });

    test("the post-departure email thanks the guest and shows the property's message", async () => {
        const text = await textOf(withExtraInfo(directBooking()), "post");

        expect([text.includes("Thank you Test Test,"), text.includes("Please leave us a review.")]).toEqual([true, true]);
    });

    test("the pre-arrival email looks up access codes while the property's texts are still loading", async () => {
        const data = withExtraInfo(directBooking());
        const texts = heldAnswer(setupRows);
        // Only the auto-email texts are held; the booking's own setup tables answer right away.
        const setupEntries = (body) => (body.TBL_NAMES.includes("_PRE_ARRIVAL_EMAIL") ? texts.answer() : []);
        gateway = installEmailGateway({ ...data, results: { "/Get_Setup_Entries_By_TBL_NAME_Multi": setupEntries, "/Get_Ac_extra": acExtra } });

        const sending = GET(emailRequest("booking/auto", { id: data.booking.booking_nbr, aname: "a35", lang: "en", mode: "pre" }));
        await settle();
        const accessCodesRequested = gateway.requests.some((r) => r.endpoint === "/Get_Ac_extra");
        texts.release();
        await sending;

        expect(accessCodesRequested).toBe(true);
    });

    test("the due email reminds the guest of the amount left to pay", async () => {
        const text = await textOf(directBooking(), "due", "en", { query: { due_amount: "250.5" } });

        expect(text).toContain("You have a due payment of US$ 250.50 to settle for your upcoming stay in igloorooms Demo Hotel.");
    });

    test("the due email without a due_amount answers 400 naming the missing field", async () => {
        const { status, html } = await send(directBooking(), "due");

        expect([status, JSON.parse(html).issues.map((issue) => issue.path)]).toEqual([400, [["due_amount"]]]);
    });

    test.each(["0", "-5", "abc"])("the due email with a due_amount of %s answers 400", async (due_amount) => {
        expect((await send(directBooking(), "due", "en", { query: { due_amount } })).status).toBe(400);
    });

    test("the due email goes out even when the other auto emails' texts can't be loaded", async () => {
        const data = directBooking();
        const setupEntries = (body) => {
            if (body.TBL_NAMES.includes("_PRE_ARRIVAL_EMAIL")) throw new Error("setup tables unavailable");
            return [];
        };
        gateway = installEmailGateway({ ...data, results: { "/Get_Setup_Entries_By_TBL_NAME_Multi": setupEntries } });

        const response = await GET(emailRequest("booking/auto", { id: data.booking.booking_nbr, aname: "a35", lang: "en", mode: "due", due_amount: "250.5" }));

        expect(response.status).toBe(200);
    });

    test("an unknown mode answers 400", async () => {
        expect((await send(directBooking(), "later")).status).toBe(400);
    });
});
