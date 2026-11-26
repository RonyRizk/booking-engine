import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import BookingPreview from "./booking-preview";
import { printableBooking } from "@/test/fixtures/printing";
import { agent } from "@/test/fixtures/city-ledger";
import { renderServer, visibleText } from "@/test/helpers/render";
import { PrintingService } from "@/lib/services/printing.service";

const billedToAgent = { id: 227 };

/**
 * An agent's booking: the Standard room, the pickup and the minibar are billed to the
 * agent, the Premium suite and the spa to the guest.
 */
const agentBooking = () => {
    const data = printableBooking();
    const { booking } = data;
    booking.agent = { id: 227, name: "Acme Travel" };
    booking.rooms[0].agent = billedToAgent;
    booking.rooms[1].agent = null;
    booking.extra_services[0].agent = null;
    booking.extra_services.push({
        system_id: 802, description: "Minibar", price: 15, start_date: "2025-09-27", end_date: "2025-09-28",
        category: { code: "001" }, agent: billedToAgent,
    });
    booking.financial = { ...booking.financial, booking_total: 444, agent_total: 168.2 };
    return data;
};

/** Everything on the booking is billed to the agent. */
const allBilledToAgent = (data) => {
    data.booking.rooms.forEach((room) => {
        room.agent = billedToAgent;
    });
    data.booking.extra_services.forEach((service) => {
        service.agent = billedToAgent;
    });
    return data;
};

const ledgerCharge = { CL_TX_ID: 1, CL_TX_TYPE_CODE: "DB", SERVICE_DATE: "2025-09-27", DESCRIPTION: "Room charge", TOTAL_AMOUNT: 120 };

const setupTables = {
    _PAY_TYPE: { "001": "Payment", "010": "Refund" },
    _PAY_METHOD: { "002": "Credit card" },
    _SVC_CATEGORY: { "001": "Transfer" },
};

const textOf = async ({ booking, property }, { stripPrices = true, clTransactions = [ledgerCharge] } = {}) =>
    visibleText(await renderServer(createElement(BookingPreview, {
        booking,
        property,
        guestCountryName: "Lebanon",
        agent: { ...agent(), payment_mode: { code: "001" } },
        printingService: new PrintingService("token"),
        setupTables,
        clTransactions,
        bedPreferences: [],
        stripPrices,
    })));

describe("booking print stripped of its prices", () => {
    describe("an agent's booking with something billed to the guest", () => {
        test("keeps the guest's balance and what was collected at the top, without the booking's and the agent's totals", async () => {
            const text = await textOf(agentBooking());

            expect([text.includes("Guest balance: US$ 294.00 Guest collected: US$ 130.00"), text.includes("Booking total"), text.includes("Agent total")])
                .toEqual([true, false, false]);
        });

        test("keeps the prices of the guest's room and shows none for the agent's", async () => {
            const text = await textOf(agentBooking());

            expect([
                text.includes("Subtotal: US$ 280.00"),
                text.includes("27/09 Sa US$ 140.00"),
                text.includes("Subtotal: US$ 120.00"),
                text.includes("US$ 60.00"),
                text.includes("US$133.20"),
            ]).toEqual([true, true, false, false, false]);
        });

        test("keeps the price of the guest's extra and shows none for the agent's extra and pickup", async () => {
            const text = await textOf(agentBooking());

            expect([text.includes("Spa access Sep 27, 2025 Sep 28, 2025 US$ 25.00"), text.includes("Minibar"), text.includes("US$ 15.00"), text.includes("Sedan"), text.includes("US$ 35.00")])
                .toEqual([true, true, false, true, false]);
        });

        test("leaves out the agent folio", async () => {
            const text = await textOf(agentBooking());

            expect([text.includes("Agent folio"), text.includes("Room charge")]).toEqual([false, false]);
        });

        test("keeps the guest folio", async () => {
            expect(await textOf(agentBooking())).toContain("Guest folio Date Amount Designation Ref Sep 20, 2025 US$ 150.00 Payment: Credit card REF-5");
        });
    });

    test("an agent's booking with everything billed to the agent shows no amount, but still lists what was booked", async () => {
        const text = await textOf(allBilledToAgent(agentBooking()));

        expect([text.includes("US$"), text.includes("Guest balance"), text.includes("Guest folio"), text.includes("Standard Rooms"), text.includes("Premium Suites"), text.includes("Spa access")])
            .toEqual([false, false, false, true, true, true]);
    });

    test("without stripPrices an agent's booking still shows the agent's prices, totals and folio", async () => {
        const text = await textOf(agentBooking(), { stripPrices: false });

        expect([text.includes("Booking total: US$ 444.00 Agent total: US$ 168.20"), text.includes("27/09 Sa US$ 60.00"), text.includes("Minibar Sep 27, 2025 Sep 28, 2025 US$ 15.00"), text.includes("Agent folio")])
            .toEqual([true, true, true, true]);
    });
});
