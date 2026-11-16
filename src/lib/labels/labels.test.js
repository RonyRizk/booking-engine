import { describe, expect, test } from "bun:test";
import { createLabels, EMAIL_LABELS, FD_LABELS } from "@/lib/labels";

describe("createLabels", () => {
    test("an email label missing from the gateway bundle renders its English text", () => {
        const { t } = createLabels(EMAIL_LABELS, "fr", { entries: {} });

        expect(t("Lcz_Booking_details")).toBe("Booking Details");
    });

    test("Hebrew renders right-to-left even though the gateway reports LTR for it", () => {
        expect(createLabels(EMAIL_LABELS, "he", { entries: {}, direction: "ltr" }).dir).toBe("rtl");
    });

    test.each([
        [undefined, "en"],
        ["   ", "en"],
        [" FR ", "fr"],
        [["AR", "fr"], "ar"],
    ])("lang %p resolves to %p", (lang, expected) => {
        expect(createLabels(EMAIL_LABELS, lang, null).lang).toBe(expected);
    });

    test("Ukrainian dates are written in Ukrainian", () => {
        expect(createLabels(FD_LABELS, "ua", null).formatDate("2026-01-05")).toContain("січ");
    });

    test("Hebrew dates are written in Hebrew", () => {
        expect(createLabels(FD_LABELS, "he", null).formatDate("2026-01-05")).toContain("בינו");
    });

    // Saturday 27 September 2025.
    test.each([
        ["en", "full", "Saturday, 27 Sep 2025"],
        ["fr", "full", "samedi, 27 sept. 2025"],
        ["en", "dmy", "27-Sep-2025"],
        ["de", "dmy", "27-Sept.-2025"],
        ["en", "dayMonth", "27/09 Sa"],
        ["fr", "dayMonth", "27/09 sam."],
    ])("in %s the %s date style reads %p", (lang, style, expected) => {
        expect(createLabels(FD_LABELS, lang, null).formatDate("2025-09-27", style)).toBe(expected);
    });

    test.each([
        ["en", "04:03 PM"],
        ["fr", "16:03"],
    ])("in %s 16:03 reads %p", (lang, expected) => {
        expect(createLabels(FD_LABELS, lang, null).formatTime(16, 3)).toBe(expected);
    });
});
