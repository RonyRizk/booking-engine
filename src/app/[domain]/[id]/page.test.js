import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import PropertyPage from "./page";
import { installFakeGateway } from "@/test/helpers/fake-gateway";

const PROPERTY = { perma_link: "demo-hotel", is_be_enabled: true };

describe("property page", () => {
    let gateway;
    const savedEnv = { APP_ENV: process.env.APP_ENV, SITE_DOMAIN: process.env.SITE_DOMAIN };
    afterEach(() => {
        gateway?.restore();
        for (const [name, value] of Object.entries(savedEnv)) {
            if (value === undefined) delete process.env[name];
            else process.env[name] = value;
        }
    });

    const open = async ({ env, siteDomain, domain = "a35.bookingmystay.com", property = PROPERTY, searchParams = {} }) => {
        process.env.APP_ENV = env;
        if (siteDomain === undefined) delete process.env.SITE_DOMAIN;
        else process.env.SITE_DOMAIN = siteDomain;
        gateway = installFakeGateway({ "/Get_BE_Token": "token", "/Get_Exposed_Property": property });
        return PropertyPage({ params: { domain, id: "a35" }, searchParams });
    };
    const redirectOf = (promise) => promise.then(() => null, (error) => error.digest ?? String(error));

    describe("in testing", () => {
        test("shows the property here instead of redirecting to its permalink", async () => {
            const html = renderToStaticMarkup(await open({ env: "testing" }));

            expect([html.includes("<ir-be"), html.includes('p="a35"'), html.includes('perma_link="demo-hotel"')]).toEqual([true, true, true]);
        });

        test("passes the stay in the URL on to the booking engine", async () => {
            const html = renderToStaticMarkup(await open({ env: "testing", searchParams: { checkin: "2026-12-01", adults: "2", lang: "fr", promo: "WINTER" } }));

            expect(["2026-12-01", 'adults="2"', 'language="fr"', 'coupon="WINTER"'].filter((text) => !html.includes(text))).toEqual([]);
        });

        test("a property with booking disabled says so, as its permalink would", async () => {
            const target = await redirectOf(open({ env: "testing", property: { ...PROPERTY, is_be_enabled: false } }));

            expect(target).toContain("/iglooroom?status=notactive");
        });
    });

    test.each(["production", ""])("with APP_ENV=%j it redirects to the permalink", async (env) => {
        expect(await redirectOf(open({ env, searchParams: { adults: "2" } }))).toContain("https://demo-hotel.bookingmystay.com");
    });

    test("redirects to the permalink on the deployment's site domain", async () => {
        const target = await redirectOf(open({ env: "production", siteDomain: "test.bookingmystay.com", searchParams: { adults: "2" } }));

        expect(target).toContain("https://demo-hotel.test.bookingmystay.com?adults=2");
    });

    describe("when the property is not found", () => {
        const notFound = (options) => redirectOf(open({ env: "production", property: null, ...options }));

        test("a property site on the deployment's site domain is sent back to that site", async () => {
            const target = await notFound({ siteDomain: "test.bookingmystay.com", domain: "tenant1.test.bookingmystay.com" });

            expect(target).toContain("https://tenant1.test.bookingmystay.com;");
        });

        test("any other host is sent to igloorooms' info site", async () => {
            const target = await notFound({ siteDomain: "test.bookingmystay.com", domain: "tenant1.bookingmystay.com" });

            expect(target).toContain("https://info.igloorooms.com/");
        });
    });
});
