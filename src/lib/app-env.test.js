import { afterEach, describe, expect, test } from "bun:test";
import { siteUrl } from "./app-env";

describe("siteUrl", () => {
    const savedSiteDomain = process.env.SITE_DOMAIN;
    afterEach(() => {
        if (savedSiteDomain === undefined) delete process.env.SITE_DOMAIN;
        else process.env.SITE_DOMAIN = savedSiteDomain;
    });
    const withSiteDomain = (value) => {
        if (value === undefined) delete process.env.SITE_DOMAIN;
        else process.env.SITE_DOMAIN = value;
    };

    test.each([undefined, "", "   "])("with SITE_DOMAIN=%j it is the production site", (value) => {
        withSiteDomain(value);

        expect(siteUrl("hotel")).toBe("https://hotel.bookingmystay.com");
    });

    test("uses the deployment's site domain, ignoring stray spaces and case", () => {
        withSiteDomain(" Test.BookingMyStay.com\n");

        expect(siteUrl("hotel")).toBe("https://hotel.test.bookingmystay.com");
    });

    test("appends a path on the property's site", () => {
        withSiteDomain("test.bookingmystay.com");

        expect(siteUrl("hotel", "/signin")).toBe("https://hotel.test.bookingmystay.com/signin");
    });
});
