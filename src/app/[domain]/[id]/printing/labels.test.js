import { afterEach, describe, expect, test } from "bun:test";
import BookingPrintingPage from "./page";
import FiscalDocumentsPage from "./fd/page";
import CityLedgerPrintingPages from "./cl/page";
import DocumentPage from "./doc/page";
import { installFakeGateway, labelRequests } from "@/test/helpers/fake-gateway";

const booking = { booking_nbr: "74046077780", rooms: [], financial: { payments: [] }, guest: {}, occupancy: {} };
const params = { domain: "a35.bookingmystay.com", id: "a35" };

const pages = [
    ["booking printing", BookingPrintingPage, { mode: "printing", id: booking.booking_nbr, token: "token", lang: "fr" }],
    ["fiscal document", FiscalDocumentsPage, { mode: "invoice", id: booking.booking_nbr, token: "token" }],
    ["city ledger", CityLedgerPrintingPages, { mode: "invoice", aid: "227", docNo: "INV-19", token: "token" }],
    ["consent document", DocumentPage, { mode: "consent", id: booking.booking_nbr, room_identifier: "room-1", token: "token" }],
];

describe("printing labels", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    test.each(pages)("the %s page loads its labels only from _FD_LABELS", async (_name, Page, searchParams) => {
        gateway = installFakeGateway({
            "/Get_Exposed_Booking": booking,
            "/Get_Exposed_Countries": [],
            "/Get_Exposed_Property": { extra_info: [{ key: "FD_LANGUAGE", value: "fr" }] },
        });

        await Page({ params, searchParams }).catch(() => null);

        expect(labelRequests(gateway.requests)).toEqual([{ code: "fr", sections: ["_FD_LABELS"] }]);
    });
});
