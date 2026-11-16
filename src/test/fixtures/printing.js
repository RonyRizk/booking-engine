import { createElement } from "react";
import { directBooking } from "@/test/fixtures/bookings";
import { installFakeGateway } from "@/test/helpers/fake-gateway";
import { renderServer } from "@/test/helpers/render";

const row = (TBL_NAME, CODE_NAME, CODE_VALUE_EN, CODE_VALUE_FR) => ({ TBL_NAME, CODE_NAME, CODE_VALUE_EN, CODE_VALUE_FR });

/** Payment setup tables, as Get_Setup_Entries_By_TBL_NAME_Multi returns them. */
export const paymentSetupRows = [
    row("_PAY_TYPE", "001", "Payment", "Paiement"),
    row("_PAY_TYPE", "010", "Refund", "Remboursement"),
    row("_PAY_METHOD", "001", "Cash", "Espèces"),
    row("_PAY_METHOD", "002", "Credit card", "Carte de crédit"),
    row("_SVC_CATEGORY", "001", "Transfer", "Transfert"),
];

const usd = { code: "USD", symbol: "US$" };
/** A line's fiscal breakdown, as Get_Exposed_Booking's financial snapshot returns it. */
const charges = (net, vatPercent = 0) => {
    const vat = Math.round(net * vatPercent) / 100;
    return { net_amount: net, vat_percent: vatPercent || null, vat_amount: vatPercent ? vat : null, city_tax_percent: null, city_tax_amount: 0, total_amount: net + vat };
};
const payment = (system_id, payment_type, amount, extra = {}) => ({
    id: system_id, system_id, amount, currency: usd, date: "2025-09-20",
    payment_type: { code: payment_type }, payment_method: { code: "002" },
    designation: "Card payment", reference: `REF-${system_id}`, is_receipt_issued: true, ...extra,
});

/**
 * A direct booking carrying everything a print can show: a payment, a refund,
 * a cancellation penalty, a guest card, an airport pickup, an extra service and
 * a departure time, at a property with an invoicing company.
 */
export const printableBooking = () => {
    const data = directBooking();
    const { booking, property } = data;
    booking.financial = {
        ...booking.financial,
        collected: 150,
        refunds: -20,
        payments: [
            payment(5, "001", 150, { receipt_nbr: "R-5" }),
            payment(6, "010", -20, { credit_receipt_nbr: "CR-6", designation: "Refund" }),
            payment(7, "013", 40, { designation: "Cancellation penalty" }),
        ],
    };
    booking.rooms.forEach((room, i) => {
        room.system_id = 101 + i;
        room.days = room.days.map((day) => ({ ...day, charges: charges(day.amount, 11) }));
    });
    booking.guest.cci = { holder_name: "Test Test", nbr: "4111********1111", expiry_month: 12, expiry_year: 29 };
    booking.guest.notes = "Late check-in";
    booking.rooms[0].departure_time = { code: "001", description: "11:00" };
    booking.pickup_info = {
        system_id: 901, date: "2025-09-27", hour: 16, minute: 3, details: "ME 211", nbr_of_units: 1,
        total: 35, currency: usd, charges: charges(35),
        selected_option: { amount: 35, currency: usd, location: { description: "Beirut airport" }, vehicle: { description: "Sedan" } },
    };
    booking.extra_services = [
        { system_id: 801, description: "Spa access", price: 25, start_date: "2025-09-27", end_date: "2025-09-28", category: { code: "001" }, charges: charges(25, 11) },
    ];
    property.company = {
        name: "Demo Hotel SAL", address: "Ice Venue 11", city: "Jounieh", postal: "1200",
        phone: "9968454545", tax_nbr: "TX-778", country: { name: "Lebanon", phone_prefix: "+961" },
        invoice_footer_notes: "<p>Thank you for staying with us.</p>",
    };
    property.tax_nbr = "TX-778";
    booking.guest_financial = { due_amount: 294, collected: 150 };
    return data;
};

/** The invoice issued for `booking`, as Get_Booking_Invoice_Info returns it. */
export const invoiceFor = (booking, extra = {}) => ({
    invoices: [{
        nbr: "INV-19", date: "2025-09-30", total_amount: booking.financial.gross_total,
        target: { code: "001" }, billed_to_name: null, credit_note: { nbr: "CN-3" },
        items: [
            ...booking.rooms.map((r) => ({ key: r.system_id, type: "BSA" })),
            { key: booking.pickup_info?.system_id, type: "PICKUP" },
            ...(booking.extra_services ?? []).map((s) => ({ key: s.system_id, type: "SVC" })),
            { key: 7, type: "PAYMENT" },
        ],
        ...extra,
    }],
});

/** `property` with `lang` set as the language of its fiscal documents. */
export const withFdLanguage = (property, lang) => ({
    ...property,
    extra_info: [...(property.extra_info ?? []), { key: "FD_LANGUAGE", value: lang }],
});

/**
 * Answers the gateway calls the printing pages make.
 *
 * @param {{ booking?: object, property?: object, labels?: object, results?: Record<string, unknown> }} options
 */
export const installPrintingGateway = ({ booking, property, labels, results = {} } = {}) =>
    installFakeGateway({
        "/Get_Exposed_Booking": booking,
        "/Get_Exposed_Property": property,
        "/Get_Exposed_Countries": [{ id: booking?.guest?.country_id, name: "Lebanon" }],
        "/Get_Setup_Entries_By_TBL_NAME_Multi": paymentSetupRows,
        "/Get_Setup_Entries_By_TBL_NAME": [],
        "/Get_Exposed_Language": labels,
        ...results,
    });

/** Renders a printing page the way the App Router does and returns its HTML. */
export const renderPage = (Page, searchParams, params = { domain: "a35.bookingmystay.com", id: "a35" }) =>
    renderServer(createElement(Page, { params, searchParams: { token: "token", ...searchParams } }));
