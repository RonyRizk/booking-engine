import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { installFakeGateway } from "@/test/helpers/fake-gateway";

let currentPath;
mock.module("next/headers", () => ({ headers: () => new Headers({ "x-current-path": currentPath }) }));

const { default: DomainLayout } = await import("./layout");

const PRODUCTION_SCRIPT = "https://wb-cmp.igloorooms.com/be/dist/iglooroom/iglooroom.esm.js";
const TESTING_SCRIPT = "https://david1chowaifaty.github.io/igloo-calendar-main-web/be-dist/iglooroom/iglooroom.esm.js";

describe("domain layout", () => {
    let gateway;
    const appEnv = process.env.APP_ENV;
    beforeEach(() => {
        gateway = installFakeGateway({ "/Get_BE_Token": "token", "/Get_Exposed_Property": { jsonld: '{"name":"Demo"}' } });
    });
    afterEach(() => {
        gateway.restore();
        if (appEnv === undefined) delete process.env.APP_ENV;
        else process.env.APP_ENV = appEnv;
    });

    const htmlAt = async (path, env) => {
        currentPath = path;
        process.env.APP_ENV = env;
        return renderToStaticMarkup(await DomainLayout({ params: { domain: "a35.bookingmystay.com" }, children: null }));
    };

    test.each(["/", "/signin", "/booked", "/a35/signin"])("%s loads the production booking engine outside testing", async (path) => {
        expect(await htmlAt(path, "production")).toContain(`${PRODUCTION_SCRIPT}?v=`);
    });

    test.each(["/", "/signin", "/booked", "/a35/signin"])("%s loads the testing booking engine in testing", async (path) => {
        const html = await htmlAt(path, "testing");

        expect([html.includes(`${TESTING_SCRIPT}?v=`), html.includes(PRODUCTION_SCRIPT)]).toEqual([true, false]);
    });

    test("a property page loads the booking engine in testing", async () => {
        expect(await htmlAt("/a35", "testing")).toContain(`${TESTING_SCRIPT}?v=`);
    });

    test("a property page doesn't get the domain's structured data in testing", async () => {
        expect(await htmlAt("/a35", "testing")).not.toContain("application/ld+json");
    });

    test("a property page loads no booking engine outside testing", async () => {
        expect(await htmlAt("/a35", "production")).not.toContain("iglooroom.esm.js");
    });

    test.each(["/a35/printing", "/a35/printing/fd", "/a35/booking"])("%s loads no booking engine in testing", async (path) => {
        expect(await htmlAt(path, "testing")).not.toContain("iglooroom.esm.js");
    });
});
