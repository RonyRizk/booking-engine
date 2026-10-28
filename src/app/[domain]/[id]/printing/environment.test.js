import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import FiscalDocumentsPage from "./fd/page";
import CityLedgerPrintingPages from "./cl/page";
import { installFakeGateway, IR, IRALPHA } from "@/test/fake-gateway";

const booking = { booking_nbr: "74046077780", rooms: [], financial: { payments: [] } };

const gatewaysHit = (requests) => [...new Set(requests.map((r) => r.baseURL))];
const endpointsHit = (requests) => requests.map((r) => r.endpoint);
// fd/page fires the receipt marking without awaiting it.
const flushPendingRequests = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("fd printing page", () => {
    let gateway;
    beforeEach(() => {
        gateway = installFakeGateway({ "/Get_Exposed_Booking": booking, "/Get_Exposed_Countries": [] });
    });
    afterEach(() => gateway.restore());

    test("environment=alpha sends every request to IRALPHA", async () => {
        await FiscalDocumentsPage({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "invoice", id: booking.booking_nbr, token: "token", environment: "alpha" },
        });

        expect(gateway.requests.length).toBeGreaterThan(0);
        expect(gatewaysHit(gateway.requests)).toEqual([IRALPHA]);
    });

    test("environment=alpha marks the printed receipt as issued on IRALPHA", async () => {
        gateway.restore();
        gateway = installFakeGateway({
            "/Get_Exposed_Booking": { ...booking, financial: { payments: [{ system_id: 5, is_receipt_issued: false }] } },
            "/Get_Exposed_Countries": [],
        });

        await FiscalDocumentsPage({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "receipt", id: booking.booking_nbr, pid: "5", documentId: "R-1", token: "token", environment: "alpha" },
        });
        await flushPendingRequests();

        expect(endpointsHit(gateway.requests)).toContain("/Mark_Payment_As_Receipt_Issued");
        expect(gatewaysHit(gateway.requests)).toEqual([IRALPHA]);
    });

    test("environment=alpha loads the booking's city ledger from IRALPHA in printing mode", async () => {
        gateway.restore();
        gateway = installFakeGateway({
            "/Get_Exposed_Booking": { ...booking, agent: { id: 227 } },
            "/Get_Exposed_Countries": [],
        });

        await FiscalDocumentsPage({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "printing", id: booking.booking_nbr, token: "token", environment: "alpha" },
        });

        expect(endpointsHit(gateway.requests)).toContain("/Fetch_CL");
        expect(gatewaysHit(gateway.requests)).toEqual([IRALPHA]);
    });

    test("without environment every request stays on IR", async () => {
        await FiscalDocumentsPage({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "invoice", id: booking.booking_nbr, token: "token" },
        });

        expect(gatewaysHit(gateway.requests)).toEqual([IR]);
    });
});

describe("cl printing page", () => {
    let gateway;
    beforeEach(() => {
        gateway = installFakeGateway({ "/Get_Exposed_Countries": [] });
    });
    afterEach(() => gateway.restore());

    test("environment=alpha sends every request to IRALPHA", async () => {
        await CityLedgerPrintingPages({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "invoice", aid: "227", docNo: "INV-19", token: "token", environment: "alpha" },
        });

        expect(endpointsHit(gateway.requests)).toContain("/Get_Setup_Entries_By_TBL_NAME_Multi");
        expect(gatewaysHit(gateway.requests)).toEqual([IRALPHA]);
    });

    test("environment=alpha loads the proforma's booking from IRALPHA", async () => {
        gateway.restore();
        gateway = installFakeGateway({ "/Get_Exposed_Countries": [], "/Get_Exposed_Booking": booking });

        await CityLedgerPrintingPages({
            params: { domain: "a35.bookingmystay.com", id: "a35" },
            searchParams: { mode: "proforma", aid: "227", id: booking.booking_nbr, token: "token", environment: "alpha" },
        });

        expect(endpointsHit(gateway.requests)).toContain("/Get_Exposed_Booking");
        expect(gatewaysHit(gateway.requests)).toEqual([IRALPHA]);
    });
});
