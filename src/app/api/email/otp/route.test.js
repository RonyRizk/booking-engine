import { afterEach, describe, expect, test } from "bun:test";
import { POST as actionPOST } from "./action/route";
import { POST as loginPOST } from "./login/route";
import { emailRequest, installEmailGateway } from "@/test/fixtures/email";
import { visibleText } from "@/test/helpers/render";
import { markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";

const geo = { country: "Lebanon", city: "Beirut", org: "Data Consult SAL", query: "185.127.183.55" };
const routes = [
    ["action", actionPOST],
    ["login", loginPOST],
];

describe.each(routes)("OTP %s email", (variant, POST) => {
    let gateway;
    afterEach(() => gateway?.restore());

    const send = async (body, lang = "en", { labels, token = "token" } = {}) => {
        gateway = installEmailGateway({ labels });
        const request = emailRequest(`otp/${variant}`, { lang }, { body, headers: token ? {} : { Authorization: "" } });
        if (!token) request.headers.delete("Authorization");
        const response = await POST(request);
        return { status: response.status, html: await response.text() };
    };
    const textOf = async (...args) => visibleText((await send(...args)).html);

    test.each(NON_LATIN_LANGS)("in %s renders every word from _EMAIL_LABELS or the request", async (lang) => {
        const body = { otp: "129382", name: "Ana", geo };
        const { html } = await send(body, lang, { labels: markedLabels("_EMAIL_LABELS") });

        expect([untranslatedWords(html, [body]), rawLabelKeys(html)]).toEqual([[], []]);
    });

    test("shows the code", async () => {
        expect(await textOf({ otp: "129382", name: "Ana" })).toContain("129382");
    });

    test("shows where the sign-in came from", async () => {
        const text = await textOf({ otp: "129382", name: "Ana", geo });

        expect([text.includes("IP: 185.127.183.55"), text.includes("Location: Lebanon, Beirut"), text.includes("Organization: Data Consult SAL")]).toEqual([true, true, true]);
    });

    test("leaves the location block out when the sign-in has no geolocation", async () => {
        expect(await textOf({ otp: "129382", name: "Ana" })).not.toContain("Login geolocation info");
    });

    test("without a token still renders, in English", async () => {
        expect(await textOf({ otp: "129382", name: "Ana" }, "fr", { token: null })).toContain("If you did not initiate the sign-in request");
    });

    test("answers 400 for a code that is too short", async () => {
        expect((await send({ otp: "12", name: "Ana" })).status).toBe(400);
    });
});

describe("OTP wording", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    test("the action email greets the user and calls the code a one-time password", async () => {
        gateway = installEmailGateway();
        const text = visibleText(await (await actionPOST(emailRequest("otp/action", { lang: "en" }, { body: { otp: "129382", name: "Ana" } }))).text());

        expect([text.includes("Dear Ana,"), text.includes("129382 is your One-Time Password (OTP) verification code.")]).toEqual([true, true]);
    });

    test("the login email calls the code a login code and doesn't greet", async () => {
        gateway = installEmailGateway();
        const text = visibleText(await (await loginPOST(emailRequest("otp/login", { lang: "en" }, { body: { otp: "129382", name: "Ana" } }))).text());

        expect([text.includes("Dear Ana,"), text.includes("129382 is your login verification code.")]).toEqual([false, true]);
    });
});
