import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

const EXTENSIONS = ["", ".jsx", ".js", "/index.jsx", "/index.js"];

const resolveImport = (from, spec) => {
    let base;
    if (spec.startsWith("@/")) base = join("src", spec.slice(2));
    else if (spec.startsWith(".")) base = normalize(join(dirname(from), spec));
    else return null;
    return EXTENSIONS.map((ext) => base + ext).find((path) => existsSync(path) && statSync(path).isFile()) ?? null;
};

const IMPORT = /(?:import|export)\s[^'"]*?from\s*["']([^"']+)["']|import\s*["']([^"']+)["']/g;

/**
 * Every project file (`.js`, `.jsx`, `.css`) that `entries` import, directly or
 * through other project files, including the entries themselves. Package imports are skipped.
 *
 * @param {string[]} entries - Paths relative to the repo root.
 * @returns {string[]}
 */
export const filesImportedBy = (entries) => {
    const seen = new Set();
    const stack = [...entries];
    while (stack.length) {
        const file = stack.pop();
        if (seen.has(file)) continue;
        seen.add(file);
        if (file.endsWith(".css")) continue;
        for (const [, from, sideEffect] of readFileSync(file, "utf8").matchAll(IMPORT)) {
            const resolved = resolveImport(file, from ?? sideEffect);
            if (resolved && /\.(jsx?|css)$/.test(resolved)) stack.push(resolved);
        }
    }
    return [...seen].sort();
};
