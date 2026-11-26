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
 *   - refund        — credit receipt for a standalone refund payment (no receipt
 *                     number, not linked to an original payment); same UI as
 *                     creditreceipt
 *
 * @param {object} props
 * @param {object} props.params                    - Next.js route segments.
 * @param {string} props.params.id                 - Property aname used to resolve the property.
 * @param {object} props.searchParams              - URL search parameters.
 * @param {("invoice"|"receipt"|"creditnote"|"creditreceipt"|"refund"|"printing"|"proforma")} props.searchParams.mode - Document mode (required).
 * @param {string} props.searchParams.bookingNbr   - Booking number (required).
 * @param {string} [props.searchParams.docNo]      - Document number shown in the header.
 * @param {("alpha"|"production")} [props.searchParams.environment="production"] - Gateway to use: "alpha" → IRALPHA, otherwise IR.
 * @param {string} [props.searchParams.strip_prices] - "true" prints `mode=printing` without the prices; an agent's
 *   booking keeps those of what is billed to the guest (see BookingPreview).
 */

import { redirect } from "next/navigation";
import "../shared/fiscal-printing.css";
import PrintFont from "@/components/printing/PrintFont";
import PrintButton from "@/components/printing/PrintButton";
import { CreditNotePreview } from "./components/credit-note-preview";
import { CreditReceiptPreview } from "./components/credit-receipt-preview";
import { InvoicePreview, ProformaPreview } from "./components/invoice-preview";
import { ReceiptPreview } from "./components/receipt-preview";
import { BookingService } from "@/lib/services/booking.service";
import { CommonServices } from "@/lib/services/common.service";
import { PrintingService } from "@/lib/services/printing.service";
import BookingPreview from "./components/booking-preview";
import { CityLedgerService } from "@/lib/services/city-ledger.service";
import { getI18n, loadDocumentProperty, loadPrintingLabels } from "@/lib/printing-i18n";
import { resolveEnvironmentBaseUrl } from "@/lib/middleware";
import { invalidLinkReason, withPrintLog } from "@/lib/printing-log";

const DEFAULT_BASE_URL = "https://gateway.igloorooms.com/IR";
const VALID_MODES = new Set(["invoice", "receipt", "creditnote", "creditreceipt", "refund", "printing", "proforma"]);
const FALLBACK_URL = "https://x.igloorooms.com/manage/acbookinglist.aspx";

const printContext = ({ params, searchParams }) => ({
    route: "fd",
    mode: searchParams.mode,
    property: params.id,
    booking: searchParams.id,
    document: searchParams.documentId ?? searchParams.pid,
    environment: searchParams.environment,
});

async function FiscalDocumentsPage({ params, searchParams }, log) {
    const {
        mode,
        id: booking_nbr,
        documentId: documentNumber,
        token,
        pid,
        ids,
        bill_to,
        environment,
        strip_prices,
    } = searchParams;

    const baseUrl = resolveEnvironmentBaseUrl(environment, DEFAULT_BASE_URL);
    const normalizedMode = mode?.toLowerCase()?.trim();

    const rejection = invalidLinkReason({ token, mode: normalizedMode, validModes: VALID_MODES, required: { booking: booking_nbr } });
    if (rejection) {
        log.rejected(rejection);
        // redirect(FALLBACK_URL);
        return <span>{getI18n().t("Lcz_SomethingWentWrongTryAgain")}</span>;
    }

    const bookingService = new BookingService();
    bookingService.setToken(token);
    bookingService.setBaseUrl(baseUrl);

    const commonService = new CommonServices();
    commonService.setToken(token);
    commonService.setBaseUrl(baseUrl);



    const printingService = new PrintingService(token);
    printingService.setBaseUrl(baseUrl);

    let property, booking, bedPreferences, setupTables, invoiceInfo, countries, agent;
    let clTransactions = [];
    try {
        const { lang: langPromise, property: propertyPromise } = loadDocumentProperty(commonService, params.id);
        const bookingPromise = langPromise.then((language) => bookingService.getExposedBooking({
            is_get_financial_snapshot: true,
            is_calculate_totals: normalizedMode === 'printing',
            booking_nbr, "extras": [
                {
                    "key": "payment_code",
                    "value": ""
                }
            ], language,
        }));
        // An agent's booking print also shows the agent's ledger; it only needs the booking.
        const agentLedgerPromise = bookingPromise.then((loaded) => {
            const agentId = loaded?.agent?.id;
            if (!agentId || normalizedMode !== "printing") {
                return null;
            }
            const cl = new CityLedgerService();
            cl.setToken(token);
            cl.setBaseUrl(baseUrl);
            return Promise.all([
                cl.getExposedAgent({ id: agentId }),
                cl.fetchCL({ AGENCY_ID: agentId, SEARCH_QUERY: booking_nbr }),
            ]);
        });
        let agentLedger;
        [property, booking, bedPreferences, setupTables, invoiceInfo, countries, , agentLedger] = await Promise.all([
            propertyPromise,
            bookingPromise,
            normalizedMode === "printing" ? bookingService.getBedPreference() : null,
            langPromise.then((lang) => commonService.getSetupEntriesByTBLNameMulti(['_PAY_TYPE', '_PAY_METHOD', "_SVC_CATEGORY"], lang)),
            (mode && ["invoice", "creditnote"].includes(mode?.toLowerCase()?.trim())) ? bookingService.getBookingInvoiceInfo({ booking_nbr }) : Promise.resolve(null),
            langPromise.then((lang) => commonService.getCountries(lang)),
            langPromise.then((lang) => loadPrintingLabels(lang, token)),
            agentLedgerPromise,
        ]);
        if (agentLedger) {
            const [agentData, clResult] = agentLedger;
            agent = agentData;
            clTransactions = clResult?.My_Result?.My_Cl_tx ?? [];
        }
    } catch (error) {
        log.failed(error);
        return <span>{getI18n().t("Lcz_SomethingWentWrongTryAgain")}</span>;
    }
    if (!booking) {
        log.rejected("booking not found");
        redirect(FALLBACK_URL);
    }
    if (normalizedMode === "receipt") {
        await printingService.checkReceipt({ booking, receiptNumber: documentNumber, paymentId: pid });
    }
    const totalPersons = printingService.calculateTotalPersons(booking);
    const guestCountryName = printingService.getUserCountry(countries, booking?.guest?.country_id);
    const privateNote = booking?.extras?.find((k) => k.key === "private_note");

    const proformaIds = ids ? ids.split("-") : null;

    const sharedProps = {
        booking: { ...booking, rooms: booking.rooms ?? [] }, property, documentNumber, invoiceInfo, setupTables, guestCountryName, totalPersons, printingService, privateNote,
        mode: normalizedMode, pid, agent, clTransactions, bedPreferences
    };

    return (
        <div className="min-h-screen bg-white">
            <PrintFont />
            {normalizedMode === "invoice" && <InvoicePreview {...sharedProps} />}
            {normalizedMode === "printing" && <BookingPreview {...sharedProps} stripPrices={strip_prices === "true"} />}
            {normalizedMode === "printing" && <PrintButton />}
            {normalizedMode === "receipt" && <ReceiptPreview {...sharedProps} />}
            {normalizedMode === "creditnote" && (
                <CreditNotePreview {...sharedProps} />
            )}
            {normalizedMode === "creditreceipt" && (
                <CreditReceiptPreview {...sharedProps} />
            )}
            {normalizedMode === "refund" && (
                <CreditReceiptPreview {...sharedProps} />
            )}
            {normalizedMode === "proforma" && (
                <ProformaPreview {...sharedProps} ids={proformaIds} billTo={bill_to} />
            )}
        </div>
    );
}

export default withPrintLog(printContext, FiscalDocumentsPage);
