import { readFileSync } from "node:fs";
import { Glob } from "bun";

const stripComments = (source) =>
    source
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .split("\n")
        .filter((line) => !line.trim().startsWith("//"))
        .join("\n");

/**
 * Every `Lcz_*` key referenced by live (uncommented) code under `patterns`.
 *
 * @param {string[]} patterns - Globs relative to the repo root.
 * @returns {string[]}
 */
export const labelKeysUsedIn = (patterns) => {
    const keys = new Set();
    for (const pattern of patterns) {
        for (const file of new Glob(pattern).scanSync({ cwd: process.cwd() })) {
            if (file.includes(".test.") || file.includes("/previews/")) continue;
            for (const key of stripComments(readFileSync(file, "utf8")).match(/Lcz_[A-Za-z0-9_]+/g) ?? []) {
                keys.add(key);
            }
        }
    }
    return [...keys].sort();
};

/** Source globs of every screen that prints a fiscal or booking document. */
export const PRINTING_SOURCES = ["src/app/\\[domain\\]/\\[id\\]/printing/**/*.{js,jsx}", "src/components/printing/**/*.{js,jsx}"];

/** Source globs of every email template and route. */
export const EMAIL_SOURCES = ["src/emails/**/*.jsx", "src/app/api/email/**/*.js"];
