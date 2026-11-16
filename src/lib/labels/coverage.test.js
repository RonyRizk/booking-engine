import { describe, expect, test } from "bun:test";
import { EMAIL_LABELS, LABEL_LANGUAGES } from "@/lib/labels";
import { EMAIL_SOURCES, labelKeysUsedIn, PRINTING_SOURCES } from "@/test/helpers/label-keys";
import fdLabels from "./fd-labels.json";
import emailLabels from "./email-labels.json";

const placeholders = (text) => (text.match(/%\d/g) ?? []).sort().join(",");

describe("_FD_LABELS", () => {
    const rows = new Map(fdLabels.map((row) => [row.CODE_NAME, row]));

    test("every row belongs to the _FD_LABELS table, once per label", () => {
        expect([new Set(fdLabels.map((r) => r.TBL_NAME)), rows.size]).toEqual([new Set(["_FD_LABELS"]), fdLabels.length]);
    });

    test("covers every label the printing screens render", () => {
        expect(labelKeysUsedIn(PRINTING_SOURCES).filter((key) => !rows.has(key))).toEqual([]);
    });

    test("translates every label into every language", () => {
        const missing = fdLabels.flatMap((row) =>
            LABEL_LANGUAGES.filter((l) => !row[`CODE_VALUE_${l}`]?.trim()).map((l) => `${row.CODE_NAME} ${l}`),
        );
        expect(missing).toEqual([]);
    });

    test("keeps the English %1 placeholders in every translation", () => {
        const broken = fdLabels.flatMap((row) =>
            LABEL_LANGUAGES.filter((l) => placeholders(row[`CODE_VALUE_${l}`] ?? "") !== placeholders(row.CODE_VALUE_EN)).map(
                (l) => `${row.CODE_NAME} ${l}`,
            ),
        );
        expect(broken).toEqual([]);
    });

    test("carries no label the printing screens don't use", () => {
        const used = new Set(labelKeysUsedIn(PRINTING_SOURCES));
        expect(fdLabels.map((r) => r.CODE_NAME).filter((key) => !used.has(key))).toEqual([]);
    });
});

describe("_EMAIL_LABELS", () => {
    test("covers every label the emails render", () => {
        const english = emailLabels[EMAIL_LABELS];
        expect(labelKeysUsedIn(EMAIL_SOURCES).filter((key) => !english[key])).toEqual([]);
    });
});
