/**
 * Booking fiscal document printing page.
 *
 * Fetches property and booking data server-side, then renders the appropriate
 * document based on the `mode` search param.
 *
 * Supported modes:
 *   - invoice     — standard booking invoice
 *   - receipt     — payment receipt
 *   - creditnote  — credit note (negated amounts)
 *
 * @param {object} props
 * @param {object} props.params                    - Next.js route segments.
 * @param {string} props.params.id                 - Property aname used to resolve the property.
 * @param {object} props.searchParams              - URL search parameters.
 * @param {("invoice"|"receipt"|"creditnote")} props.searchParams.mode - Document mode (required).
 * @param {string} props.searchParams.bookingNbr   - Booking number (required).
 * @param {string} [props.searchParams.docNo]      - Document number shown in the header.
 * @param {string} [props.searchParams.lang="en"]  - Language code for localised values.
 */

import { redirect } from "next/navigation";
import "../cl/cl-printing.css";
import { CreditNotePreview } from "./components/credit-note-preview";
import { InvoicePreview } from "./components/invoice-preview";
import { ReceiptPreview } from "./components/receipt-preview";
import { BookingService } from "@/lib/services/booking.service";
import { CommonServices } from "@/lib/services/common.service";
import { PrintingService } from "@/lib/services/printing.service";

const DEFAULT_BASE_URL = "https://gateway.igloorooms.com/IR";
const VALID_MODES = new Set(["invoice", "receipt", "creditnote"]);
const FALLBACK_URL = "https://x.igloorooms.com/manage/acbookinglist.aspx";

export default async function FiscalDocumentsPage({ params, searchParams }) {
    const {
        mode,
        id: booking_nbr,
        documentId: documentNumber,
        lang = "en",
        token,
        pid,
        rnb,
    } = searchParams;

    const normalizedMode = mode?.toLowerCase()?.trim();

    if (
        !token ||
        !normalizedMode ||
        !booking_nbr ||
        !VALID_MODES.has(normalizedMode)
    ) {
        // redirect(FALLBACK_URL);
        return <span> something went wrong alo</span>;
    }

    const bookingService = new BookingService();
    bookingService.setToken(token);
    bookingService.setBaseUrl(DEFAULT_BASE_URL);

    const commonService = new CommonServices();
    commonService.setToken(token);
    commonService.setBaseUrl(DEFAULT_BASE_URL);

    const printingService = new PrintingService(token);

    let property, booking, setupTables, invoiceInfo, countries, localesRaw;
    try {
        [property, booking, setupTables, invoiceInfo, countries, localesRaw] = await Promise.all([
            commonService.getExposedProperty(params.id, lang),
            bookingService.getExposedBooking({
                booking_nbr, "extras": [
                    {
                        "key": "payment_code",
                        "value": ""
                    }
                ], language: lang, is_get_financial_snapshot: true
            }),
            commonService.getSetupEntriesByTBLNameMulti(['_PAY_TYPE', '_PAY_TYPE_GROUP', '_PAY_METHOD'], 'en'),
            (mode && ["invoice", "creditnote"].includes(mode?.toLowerCase()?.trim())) ? bookingService.getBookingInvoiceInfo({ booking_nbr }) : Promise.resolve(null),
            commonService.getCountries(lang),
            commonService.fetchLanguage(lang, ["_PRINT_FRONT", "_PMS_FRONT"]),
        ]);
    } catch (error) {
        console.error("fd/page fetch error:", error);
        return <span>Something went wrong. Please try again.</span>;
    }

    if (!booking) {
        redirect(FALLBACK_URL);
    }
    if (normalizedMode === "receipt") {
        printingService.checkReceipt({ booking, receiptNumber: rnb, paymentId: pid })
    }
    const locales = localesRaw?.entries;
    const totalPersons = printingService.calculateTotalPersons(booking);
    const guestCountryName = printingService.getUserCountry(countries, booking?.guest?.country_id);
    const privateNote = booking?.extras?.find((k) => k.key === "private_note");

    const sharedProps = {
        booking, property, documentNumber, invoiceInfo, setupTables,
        locales, guestCountryName, totalPersons, printingService, privateNote,
        mode: normalizedMode, pid, rnb,
    };
    return (
        <div className="min-h-screen bg-white">
            {normalizedMode === "invoice" && <InvoicePreview {...sharedProps} />}
            {normalizedMode === "receipt" && <ReceiptPreview {...sharedProps} />}
            {normalizedMode === "creditnote" && (
                <CreditNotePreview {...sharedProps} />
            )}
        </div>
    );
}
