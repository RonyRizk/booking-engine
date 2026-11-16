import { afterEach, expect, test } from "bun:test";
import BookedPage from "./page";
import { installFakeGateway } from "@/test/helpers/fake-gateway";

let gateway;
const savedSiteDomain = process.env.SITE_DOMAIN;
afterEach(() => {
    gateway?.restore();
    if (savedSiteDomain === undefined) delete process.env.SITE_DOMAIN;
    else process.env.SITE_DOMAIN = savedSiteDomain;
});

const redirectOf = (promise) => promise.then(() => null, (error) => error.digest ?? String(error));

// Next always passes searchParams; this guards a caller that doesn't.
test("without search params it sends the guest to the property's site on the deployment's domain", async () => {
    process.env.SITE_DOMAIN = "test.bookingmystay.com";
    gateway = installFakeGateway({ "/Get_BE_Token": "token", "/Get_Exposed_Property": { perma_link: "tenant1", is_be_enabled: true } });

    const target = await redirectOf(BookedPage({ params: { domain: "tenant1.test.bookingmystay.com" }, searchParams: undefined }));

    expect(target).toContain(";https://tenant1.test.bookingmystay.com;");
});
