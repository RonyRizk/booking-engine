import { describe, expect, test } from "bun:test";
import { escapeJsonLd } from "./jsonld";

const jsonld = JSON.stringify({
    "@type": "Hotel",
    description: '<div>reviews</div><script async src="https://www.jscache.com/wejs"></script>',
    telephone: "22922536",
});

describe("escapeJsonLd", () => {
    test("leaves no raw `<` that could close the script tag", () => {
        const escaped = escapeJsonLd(jsonld);
        expect(escaped).not.toContain("<");
        expect(escaped).toContain("\\u003c/script>");
    });

    test("parses to the same value as the original", () => {
        expect(JSON.parse(escapeJsonLd(jsonld))).toEqual(JSON.parse(jsonld));
    });
});
