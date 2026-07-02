/**
 * Booking fiscal document printing page.
 *
 * Fetches property and booking data server-side, then renders the appropriate
 * document based on the `mode` search param.
 *
 * Supported modes:
 *   - invoice       — standard booking invoice
 *   - receipt       — payment receipt
 *   - creditnote    — credit note (negated amounts, references original invoice)
 *   - creditreceipt — credit receipt (negated amounts, references original receipt)
 *
 * @param {object} props
 * @param {object} props.params                    - Next.js route segments.
 * @param {string} props.params.id                 - Property aname used to resolve the property.
 * @param {object} props.searchParams              - URL search parameters.
 * @param {("invoice"|"receipt"|"creditnote"|"creditreceipt"|"printing","proforma")} props.searchParams.mode - Document mode (required).
 * @param {string} props.searchParams.bookingNbr   - Booking number (required).
 * @param {string} [props.searchParams.docNo]      - Document number shown in the header.
 * @param {string} [props.searchParams.lang="en"]  - Language code for localised values.
 */

import { redirect } from "next/navigation";
import "../cl/cl-printing.css";
import { CreditNotePreview } from "./components/credit-note-preview";
import { CreditReceiptPreview } from "./components/credit-receipt-preview";
import { InvoicePreview, ProformaPreview } from "./components/invoice-preview";
import { ReceiptPreview } from "./components/receipt-preview";
import { BookingService } from "@/lib/services/booking.service";
import { CommonServices } from "@/lib/services/common.service";
import { PrintingService } from "@/lib/services/printing.service";
import BookingPreview from "./components/booking-preview";
import { CityLedgerService } from "@/lib/services/city-ledger.service";

const DEFAULT_BASE_URL = "https://gateway.igloorooms.com/IR";
const VALID_MODES = new Set(["invoice", "receipt", "creditnote", "creditreceipt", "printing", "proforma"]);
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
        ids,
        bill_to,
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

    let property, booking, bedPreferences, setupTables, invoiceInfo, countries, localesRaw, agent;
    let clTransactions = [];
    try {
        [property, booking, bedPreferences, setupTables, invoiceInfo, countries, localesRaw] = await Promise.all([
            commonService.getExposedProperty(params.id, lang),
            bookingService.getExposedBooking({
                is_get_financial_snapshot: true,
                booking_nbr, "extras": [
                    {
                        "key": "payment_code",
                        "value": ""
                    }
                ], language: lang,
            }),
            bookingService.getBedPreference(),
            commonService.getSetupEntriesByTBLNameMulti(['_PAY_TYPE', '_PAY_TYPE_GROUP', '_PAY_METHOD', "_SVC_CATEGORY"], 'en'),
            (mode && ["invoice", "creditnote"].includes(mode?.toLowerCase()?.trim())) ? bookingService.getBookingInvoiceInfo({ booking_nbr }) : Promise.resolve(null),
            commonService.getCountries(lang),
            commonService.fetchLanguage(lang, ["_PRINT_FRONT", "_PMS_FRONT"]),
        ]);
        if (booking.agent?.id && normalizedMode === "printing") {
            const cl = new CityLedgerService();
            cl.setToken(token);
            cl.setBaseUrl(DEFAULT_BASE_URL);
            const [agentData, clResult] = await Promise.all([
                cl.getExposedAgent({ id: booking.agent.id }),
                cl.fetchCL({ AGENCY_ID: booking.agent.id, SEARCH_QUERY: booking_nbr }),
            ]);
            agent = agentData;
            clTransactions = clResult?.My_Result?.My_Cl_tx ?? [];
        }
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

    const proformaIds = ids ? ids.split("-") : null;

    const sharedProps = {
        booking, property, documentNumber, invoiceInfo, setupTables,
        locales, guestCountryName, totalPersons, printingService, privateNote,
        mode: normalizedMode, pid, rnb, agent, clTransactions, bedPreferences
    };

    return (
        <div className="min-h-screen bg-white">
            {normalizedMode === "invoice" && <InvoicePreview {...sharedProps} />}
            {normalizedMode === "printing" && <BookingPreview {...sharedProps} />}
            {normalizedMode === "receipt" && <ReceiptPreview {...sharedProps} />}
            {normalizedMode === "creditnote" && (
                <CreditNotePreview {...sharedProps} />
            )}
            {normalizedMode === "creditreceipt" && (
                <CreditReceiptPreview {...sharedProps} />
            )}
            {normalizedMode === "proforma" && (
                <ProformaPreview {...sharedProps} ids={proformaIds} billTo={bill_to} />
            )}
        </div>
    );
}
