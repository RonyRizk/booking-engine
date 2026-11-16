import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { installFakeGateway } from "@/test/helpers/fake-gateway";

let currentPath;
mock.module("next/headers", () => ({ headers: () => new Headers({ "x-current-path": currentPath }) }));

const { generateMetadata: domainMetadata } = await import("./layout");
const { generateMetadata: propertyMetadata } = await import("./[id]/layout");
const { generateImageMetadata } = await import("./opengraph-image");

const LAYOUTS = [
    ["domain", domainMetadata],
    ["property", propertyMetadata],
];
const metadataOf = (generateMetadata, path) => {
    currentPath = path;
    return generateMetadata({ params: { domain: "a35.bookingmystay.com", id: "a35" } }, Promise.resolve({}));
};

describe("layout metadata", () => {
    let gateway;
    beforeEach(() => {
        gateway = installFakeGateway({
            "/Get_BE_Token": "token",
            "/Get_Exposed_Property": { name: "Demo Hotel", country: { name: "Lebanon" } },
        });
    });
    afterEach(() => gateway.restore());

    test.each(LAYOUTS.flatMap(([name, generate]) => ["/a35/printing", "/a35/printing/fd", "/a35/printing/cl"].map((path) => [name, path, generate])))(
        "the %s layout calls no gateway for the print page %s",
        async (_name, path, generate) => {
            await metadataOf(generate, path);

            expect(gateway.requests).toEqual([]);
        },
    );

    test.each(LAYOUTS.flatMap(([name, generate]) => ["/", "/a35", "/a35/signin", "/printing", "/a35/printing-terms"].map((path) => [name, path, generate])))(
        "the %s layout titles %s with the property",
        async (_name, path, generate) => {
            expect((await metadataOf(generate, path)).title).toBe("Demo Hotel, Lebanon - Book direct");
        },
    );

    test("social images of a booking page resolve against the property's own host", async () => {
        expect((await metadataOf(domainMetadata, "/")).metadataBase).toEqual(new URL("https://a35.bookingmystay.com"));
    });

    describe("Open Graph image", () => {
        const imagesOf = (path) => {
            currentPath = path;
            return generateImageMetadata({ params: { domain: "a35.bookingmystay.com" } });
        };

        test.each(["/a35/printing", "/a35/printing/fd", "/a35/printing/cl"])("a print page has none and calls no gateway: %s", async (path) => {
            expect([await imagesOf(path), gateway.requests]).toEqual([[], []]);
        });

        test.each(["/", "/a35", "/a35/printing-terms"])("%s is described by the property", async (path) => {
            expect((await imagesOf(path)).map((image) => image.alt)).toEqual(["Demo Hotel – Book direct"]);
        });
    });
});
