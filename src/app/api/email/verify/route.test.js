import { afterEach, describe, expect, test } from "bun:test";
import { POST } from "./route";
import { emailRequest, installEmailGateway } from "@/test/fixtures/email";
import { visibleText } from "@/test/helpers/render";
import { markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";

const body = { url: "https://x.igloorooms.com/verify?k=1", name: "Anna Smith" };

describe("verify email", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    const send = async (requestBody, lang = "en", labels) => {
        gateway = installEmailGateway({ labels });
        const response = await POST(emailRequest("verify", { lang }, { body: requestBody }));
        return { status: response.status, html: await response.text() };
    };

    test.each(NON_LATIN_LANGS)("in %s renders every word from _EMAIL_LABELS or the request", async (lang) => {
        const { html } = await send(body, lang, markedLabels("_EMAIL_LABELS"));

        expect([untranslatedWords(html, [body, "https://help.igloorooms.com"]), rawLabelKeys(html)]).toEqual([[], []]);
    });

    test("the verify button opens the verification link", async () => {
        const { html } = await send(body);

        expect(html).toMatch(/<a[^>]*href="https:\/\/x\.igloorooms\.com\/verify\?k=1"[^>]*>[\s\S]*?Verify email/);
    });

    test("the support link can be clicked", async () => {
        const { html } = await send(body);

        expect(html).toMatch(/<a[^>]*href="https:\/\/help\.igloorooms\.com"/);
    });

    test("answers 400 for a link that isn't a URL", async () => {
        expect((await send({ ...body, url: "not a url" })).status).toBe(400);
    });
});
