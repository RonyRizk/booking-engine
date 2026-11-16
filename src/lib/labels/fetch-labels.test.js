import { afterEach, describe, expect, test } from "bun:test";
import { EMAIL_LABELS, fetchLabels } from "@/lib/labels";
import { installFakeGateway, labelRequests } from "@/test/helpers/fake-gateway";

const frenchBundle = {
    entries: [{ code: "Lcz_Booking_details", description: "Détails de la réservation" }],
    direction: "LTR",
};

describe("fetchLabels", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    test("requests only the given table in the requested language", async () => {
        gateway = installFakeGateway({ "/Get_Exposed_Language": frenchBundle });

        await fetchLabels(EMAIL_LABELS, " FR", { token: "token" });

        expect(labelRequests(gateway.requests)).toEqual([{ code: "fr", sections: ["_EMAIL_LABELS"] }]);
    });

    test("renders the gateway's translation of a label", async () => {
        gateway = installFakeGateway({ "/Get_Exposed_Language": frenchBundle });

        const { t } = await fetchLabels(EMAIL_LABELS, "fr", { token: "token" });

        expect(t("Lcz_Booking_details")).toBe("Détails de la réservation");
    });

    test("without a token it renders English without calling the gateway", async () => {
        gateway = installFakeGateway({ "/Get_Exposed_Language": frenchBundle });

        const { t } = await fetchLabels(EMAIL_LABELS, "fr", { token: null });

        expect([t("Lcz_Booking_details"), gateway.requests.length]).toEqual(["Booking Details", 0]);
    });

    test("when the gateway fails it renders English instead of throwing", async () => {
        gateway = installFakeGateway({ "/Get_Exposed_Language": new Error("Language service down") });

        const { t } = await fetchLabels(EMAIL_LABELS, "fr", { token: "token" });

        expect(t("Lcz_Booking_details")).toBe("Booking Details");
    });
});
