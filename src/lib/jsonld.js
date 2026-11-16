/**
 * Makes a JSON-LD string safe to inline in a <script type="application/ld+json">.
 * Escapes every `<` as `\u003c` so markup inside string values (e.g. a `</script>`
 * from a property description) can't close the tag early. In valid JSON `<` only
 * appears inside strings, so the parsed result is unchanged.
 *
 * @param {string} jsonld
 * @returns {string}
 */
export const escapeJsonLd = (jsonld) => jsonld.replace(/</g, "\\u003c");
