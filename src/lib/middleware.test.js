import { describe, expect, test } from "bun:test";
import { getEnvironmentBaseUrl, resolveEnvironmentBaseUrl } from "./middleware";

const IR = "https://gateway.igloorooms.com/IR";
const IRBE = "https://gateway.igloorooms.com/IRBE";
const IRALPHA = "https://gateway.igloorooms.com/IRALPHA";

const requestWithHeaders = (headers) => new Request("http://localhost/api/email/booking", { headers });

describe("resolveEnvironmentBaseUrl", () => {
    test("alpha environment uses the IRALPHA gateway", () => {
        expect(resolveEnvironmentBaseUrl("alpha", IR)).toBe(IRALPHA);
    });

    test("production environment uses the default gateway", () => {
        expect(resolveEnvironmentBaseUrl("production", IR)).toBe(IR);
    });

    test("missing environment uses the default gateway", () => {
        expect(resolveEnvironmentBaseUrl(undefined, IR)).toBe(IR);
    });

    test("environment is matched case-insensitively and ignores surrounding whitespace", () => {
        expect(resolveEnvironmentBaseUrl("  Alpha ", IR)).toBe(IRALPHA);
    });
});

describe("getEnvironmentBaseUrl", () => {
    test("Environment: alpha header uses the IRALPHA gateway", () => {
        expect(getEnvironmentBaseUrl(requestWithHeaders({ Environment: "alpha" }))).toBe(IRALPHA);
    });

    test("without an Environment header email routes keep the IRBE gateway", () => {
        expect(getEnvironmentBaseUrl(requestWithHeaders({}))).toBe(IRBE);
    });

    test("without an Environment header the given default is used", () => {
        expect(getEnvironmentBaseUrl(requestWithHeaders({}), IR)).toBe(IR);
    });
});
