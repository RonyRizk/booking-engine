import { afterEach, describe, expect, test } from "bun:test";
import { GET } from "./route";
import { emailRequest, installEmailGateway } from "@/test/fixtures/email";
import { visibleText } from "@/test/helpers/render";
import { markedLabels, NON_LATIN_LANGS, rawLabelKeys, untranslatedWords } from "@/test/helpers/localization";

const issue = { unit: { name: "Room 12" }, housekeeper_name: "Maria Lopez", description: "Leaking shower head" };
const query = (lang = "en") => ({ property_id: "42", unit_id: "7", lang });

describe("housekeeping issue email", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    const send = async (issues, lang = "en", labels) => {
        gateway = installEmailGateway({ labels, results: { "/Get_HK_Issues": issues } });
        const response = await GET(emailRequest("hkissue", query(lang)));
        return { status: response.status, html: await response.text() };
    };

    test.each(NON_LATIN_LANGS)("in %s renders every word from _EMAIL_LABELS or the issue", async (lang) => {
        const { html } = await send([issue], lang, markedLabels("_EMAIL_LABELS"));

        expect([untranslatedWords(html, [issue]), rawLabelKeys(html)]).toEqual([[], []]);
    });

    test("names the unit, the housekeeper and what they reported", async () => {
        const text = visibleText((await send([issue])).html);

        expect(text).toContain("Unit: Room 12 Housekeeper: Maria Lopez Reporting: Leaking shower head");
    });

    test("answers 404 when the unit has no open issue", async () => {
        expect((await send([])).status).toBe(404);
    });

    test("answers 400 without a unit", async () => {
        gateway = installEmailGateway();

        expect((await GET(emailRequest("hkissue", { property_id: "42", lang: "en" }))).status).toBe(400);
    });
});
