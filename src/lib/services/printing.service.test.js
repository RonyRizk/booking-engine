import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";
import { PrintingService } from "./printing.service";
import { errorLogger } from "@/logger";
import { installFakeGateway, IRALPHA } from "@/test/helpers/fake-gateway";

const bookingWithUnissuedReceipt = {
    booking_nbr: "74046077780",
    financial: { payments: [{ system_id: 5, is_receipt_issued: false }] },
};

describe("PrintingService.checkReceipt", () => {
    let gateway;
    beforeEach(() => {
        gateway = installFakeGateway();
    });
    afterEach(() => gateway.restore());

    test("marks the receipt as issued on the gateway set with setBaseUrl", async () => {
        const printingService = new PrintingService("token");
        printingService.setBaseUrl(IRALPHA);

        await printingService.checkReceipt({ booking: bookingWithUnissuedReceipt, receiptNumber: "R-1", paymentId: "5" });

        expect(gateway.requests).toMatchObject([{ baseURL: IRALPHA, endpoint: "/Mark_Payment_As_Receipt_Issued" }]);
    });
});

describe("PrintingService.checkReceipt when marking fails", () => {
    test("records the failure at error level, the only way it reaches the log file", async () => {
        const gateway = installFakeGateway({ "/Mark_Payment_As_Receipt_Issued": new Error("Marking service down") });
        const logged = spyOn(errorLogger, "error").mockImplementation(() => {});
        const printingService = new PrintingService("token");

        await printingService.checkReceipt({ booking: bookingWithUnissuedReceipt, receiptNumber: "R-1", paymentId: "5" });
        const messages = logged.mock.calls.map(([error]) => error.message);

        logged.mockRestore();
        gateway.restore();
        expect(messages).toEqual(["Marking service down"]);
    });
});
