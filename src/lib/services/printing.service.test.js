import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { PrintingService } from "./printing.service";
import { installFakeGateway, IRALPHA } from "@/test/fake-gateway";

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

        expect(gateway.requests).toEqual([{ baseURL: IRALPHA, endpoint: "/Mark_Payment_As_Receipt_Issued" }]);
    });
});
