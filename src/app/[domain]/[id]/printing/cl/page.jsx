import { redirect } from "next/navigation";
import { CityLedgerService } from "@/lib/services/city-ledger.service";
import { BookingService } from "@/lib/services/booking.service";
import { InvoicePreview } from "./components/invoice-preview";
import { ReceiptPreview } from "./components/receipt-preview";
import { CreditNotePreview } from "./components/credit-note-preview";
import { DebitNotePreview } from "./components/debit-note-preview";
import { StatementPreview } from "./components/statement-preview";
import { ProformaPreview } from "./components/proforma-preview";
import "../shared/fiscal-printing.css";
import PrintFont from "@/components/printing/PrintFont";
import { CommonServices } from "@/lib/services/common.service";
import { ClTxTypeCode, FdTypes } from "@/lib/enums";
import { convertBookingToCL } from "./utils/booking-to-cl";
import { getI18n, loadDocumentProperty, loadPrintingLabels } from "@/lib/printing-i18n";
import { resolveEnvironmentBaseUrl } from "@/lib/middleware";
import { invalidLinkReason, withPrintLog } from "@/lib/printing-log";

const DEFAULT_BASE_URL = "https://gateway.igloorooms.com/IR";
const VALID_MODES = new Set([
    "invoice",
    "receipt",
    "creditnote",
    "creditreceipt",
    "debitnote",
    "statement",
    "draft",
    "proforma",
]);
const FD_TYPES = [FdTypes.CreditNote, FdTypes.DebitNote, FdTypes.Invoice, FdTypes.CreditReceipt, FdTypes.Receipt];
const FALLBACK_URL = "https://x.igloorooms.com/manage/acbookinglist.aspx";

const printContext = ({ params, searchParams }) => ({
    route: "cl",
    mode: searchParams.mode,
    property: params.id,
    agent: searchParams.aid,
    document: searchParams.docNo,
    booking: searchParams.id,
    from: searchParams.from,
    to: searchParams.to,
    environment: searchParams.environment,
});

/**
 * Loads the _SVC_CATEGORY setup table used to turn the raw category codes that
 * booking-service CL rows carry in DESCRIPTION into readable labels.
 * Resolves to an empty map on failure so the document still renders with the
 * raw descriptions instead of erroring out.
 */
const fetchSvcCategory = ({ token, lang, baseUrl }) => {
    const commonService = new CommonServices(baseUrl);
    commonService.setToken(token);
    return lang
        .then((language) => commonService.getSetupEntriesByTBLNameMulti(["_SVC_CATEGORY"], language))
        .then((setupEntries) => setupEntries?._SVC_CATEGORY ?? {})
        .catch(() => ({}));
};

/**
 * Per-mode fetchers. They start together with the property request and get it,
 * and the document's language, as promises: only a fetcher that needs one awaits
 * it (statement: the currency; services: the language), so the others don't wait.
 * Add a new entry here when introducing a new mode.
 *
 * @type {Record<string, (cl: CityLedgerService, propertyPromise: Promise<object>, params: object) => Promise<object>>}
 */
const FETCHERS = {
    invoice: (cl, _property, { agentId, documentNumber, token, lang, baseUrl }) =>
        Promise.all([
            cl.fetchCL({ AGENCY_ID: agentId, SEARCH_QUERY: documentNumber }),
            fetchSvcCategory({ token, lang, baseUrl }),
        ]).then(([result, svcCategory]) => ({
            transactions: result?.My_Result?.My_Cl_tx ?? [],
            svcCategory,
        })),
    draft: (cl, _property, { agentId, documentNumber, token, lang, baseUrl }) =>
        Promise.all([
            cl.fetchCL({ AGENCY_ID: agentId, SEARCH_QUERY: documentNumber }),
            fetchSvcCategory({ token, lang, baseUrl }),
        ]).then(([result, svcCategory]) => ({
            transactions: result?.My_Result?.My_Cl_tx ?? [],
            svcCategory,
        })),

    receipt: (cl, _property, { agentId, documentNumber }) =>
        Promise.all([
            cl.fetchCL({ AGENCY_ID: agentId, SEARCH_QUERY: documentNumber }),
            cl.getPaymentMethods(),
            cl.getFiscalDocuments({ AGENCY_ID: agentId, DOC_NUMBER: documentNumber }),
        ]).then(([clResult, paymentMethods, docs]) => ({
            clEntry: clResult?.My_Result?.My_Cl_tx?.find(tx => tx.DOC_NUMBER === documentNumber) ?? null,
            paymentMethods,
            document: docs?.My_Rows?.find(doc => doc.DOC_NUMBER === documentNumber) ?? null,
        })),

    creditnote: (cl, _property, { agentId, documentNumber }) =>
        cl
            .getFiscalDocuments({ AGENCY_ID: agentId, DOC_NUMBER: documentNumber })
            .then((docs) => {
                return { document: docs?.My_Rows?.find(doc => doc.DOC_NUMBER === documentNumber) ?? null };
            }),

    creditreceipt: (cl, _property, { agentId, documentNumber }) =>
        cl
            .getFiscalDocuments({ AGENCY_ID: agentId, DOC_NUMBER: documentNumber })
            .then((docs) => {
                return { document: docs?.My_Rows?.find(doc => doc.DOC_NUMBER === documentNumber) ?? null };
            }),

    debitnote: (cl, _property, { agentId, documentNumber }) =>
        Promise.all([
            cl.fetchCL({ AGENCY_ID: agentId, SEARCH_QUERY: documentNumber }),
            cl.getFiscalDocuments({ AGENCY_ID: agentId, DOC_NUMBER: documentNumber }),
        ]).then(([clResult, docs]) => ({
            transactions: clResult?.My_Result?.My_Cl_tx ?? [],
            document: docs?.My_Rows?.find(doc => doc.DOC_NUMBER === documentNumber) ?? null,
        })),

    proforma: async (
        cl,
        _property,
        { agentId, fromDate, toDate, bookingId, token, lang: langPromise, baseUrl },
    ) => {
        const commonService = new CommonServices(baseUrl);
        commonService.setToken(token);
        const invoicedClTxTypeCode = new Set([ClTxTypeCode.Adjustment, ClTxTypeCode.CancellationPenalty, ClTxTypeCode.Discount, ClTxTypeCode.StandardChargeDebit]);

        if (bookingId) {
            const bookingService = new BookingService(baseUrl);
            bookingService.setToken(token);
            const [clResult, booking, setupEntries] = await Promise.all([
                cl.fetchCL({
                    AGENCY_ID: agentId,
                    SEARCH_QUERY: bookingId,
                    FROM_DATE: null,
                    TO_DATE: null,
                    IS_LOCKED: false,
                    IS_HOLD: false
                }),
                langPromise.then((language) => bookingService.getExposedBooking({
                    booking_nbr: bookingId,
                    language,
                    is_get_financial_snapshot: true,
                    extras: [
                        {
                            key: "payment_code",
                            value: "",
                        },
                    ],
                })),
                langPromise.then((language) => commonService.getSetupEntriesByTBLNameMulti(["_SVC_CATEGORY"], language)),
            ]);
            const clTxs = (clResult?.My_Result?.My_Cl_tx ?? []).filter(tx => invoicedClTxTypeCode.has(tx.CL_TX_TYPE_CODE));
            return {
                transactions: convertBookingToCL({ booking, agentId, clTxs, setupEntries }),
            };
        }
        const clResult = await cl.fetchCL({
            AGENCY_ID: agentId,
            FROM_DATE: fromDate,
            TO_DATE: toDate,
            IS_HOLD: false,
            IS_LOCKED: false
        });

        return { transactions: (clResult?.My_Result?.My_Cl_tx ?? []).filter(tx => invoicedClTxTypeCode.has(tx.CL_TX_TYPE_CODE)) };
    },

    statement: (cl, propertyPromise, { agentId, fromDate, toDate }) =>
        Promise.all([
            propertyPromise.then((property) => cl.getCLStatement({
                AGENCY_ID: agentId,
                CURRENCY_ID: property?.currency?.id,
                START_DATE: fromDate,
                END_DATE: toDate,
            })),
            cl.getFiscalDocuments({
                AGENCY_ID: agentId,
                START_DATE: fromDate,
                END_DATE: toDate,
                LIST_FD_TYPE_CODE: FD_TYPES,
            }),
        ]).then(([statement, fiscalDocuments]) => ({
            statement,
            fiscalDocuments: fiscalDocuments?.My_Rows ?? [],
        })),
};

/**
 * City ledger printing page — fetches all data server-side and renders the
 * appropriate document based on the `mod` search param.
 *
 * @param {Object} props
 * @param {Object} props.params - Next.js route segments.
 * @param {string} props.params.id - Property aname / slug used to resolve the property.
 * @param {Object} props.searchParams - URL search parameters.
 * @param {string}  props.searchParams.token   - CL access token (required).
 * @param {("invoice"|"receipt"|"creditnote"|"creditreceipt"|"debitnote"|"statement")} props.searchParams.mode - Document mode (required).
 * @param {string}  props.searchParams.aid   - Agent ID (required).
 * @param {string}  [props.searchParams.docNo] - Document number (invoice / receipt / credit-debit note).
 * @param {string}  [props.searchParams.from]  - Statement start date (YYYY-MM-DD).
 * @param {string}  [props.searchParams.to]    - Statement end date (YYYY-MM-DD).
 * @param {string}  [props.searchParams.ref]   - External reference (credit note).
 * @param {string}  [props.searchParams.collapse_units] - "true" to print one summed row per unit instead of one per night (invoice / draft / proforma).
 * @param {("alpha"|"production")} [props.searchParams.environment="production"] - Gateway to use: "alpha" → IRALPHA, otherwise IR.
 */
async function CityLedgerPrintingPages({
    searchParams,
    params,
}, log) {
    const {
        token,
        mode,
        aid: agentId,
        docNo: documentNumber,
        from: fromDate,
        to: toDate,
        ref: externalRef,
        id: bookingId,
        collapse_units,
        environment,
    } = searchParams;
    const collapseUnits = collapse_units === "true";
    const baseUrl = resolveEnvironmentBaseUrl(environment, DEFAULT_BASE_URL);

    const normalizedMode = mode?.toLowerCase()?.trim();

    const rejection = invalidLinkReason({ token, mode: normalizedMode, validModes: VALID_MODES, required: { agent: agentId } });
    if (rejection) {
        log.rejected(rejection);
        redirect(FALLBACK_URL);
    }

    const cl = new CityLedgerService(baseUrl);
    cl.setToken(token);

    const commonService = new CommonServices();
    commonService.setToken(token);
    commonService.setBaseUrl(baseUrl);

    // Everything starts at once; the mode's fetcher only waits for the property if it needs it.
    const { lang: langPromise, property: propertyPromise } = loadDocumentProperty(commonService, params.id);
    let property;
    let agent;
    let countries;
    let modeData;
    try {
        [property, agent, countries, , modeData] = await Promise.all([
            propertyPromise,
            cl.getExposedAgent({ id: agentId }),
            langPromise.then((lang) => commonService.getCountries(lang)),
            langPromise.then((lang) => loadPrintingLabels(lang, token)),
            FETCHERS[normalizedMode](cl, propertyPromise, {
                agentId,
                documentNumber,
                fromDate,
                toDate,
                externalRef,
                bookingId,
                token,
                lang: langPromise,
                baseUrl,
            }),
        ]);
        if (agent && agent.country_id) {
            const countryEntry = countries?.find((c) => c.id === agent.country_id);
            agent = { ...agent, countryName: countryEntry?.name ?? null };
        }
    } catch (error) {
        log.failed(error);
        return <span>{getI18n().t("Lcz_SomethingWentWrongTryAgain")}</span>;
    }
    // const agent = property?.agents?.find(a => Number(a.id) === Number(agentId)) ?? null;
    const sharedProps = { property, agent, ...modeData };
    return (
        <div className="min-h-screen bg-white">
            <PrintFont />
            {["invoice", "draft"].includes(normalizedMode) && (
                <InvoicePreview
                    isDraft={normalizedMode === "draft"}
                    {...sharedProps}
                    documentNumber={documentNumber}
                    collapseUnits={collapseUnits}
                />
            )}
            {normalizedMode === "receipt" && (
                <ReceiptPreview {...sharedProps} documentNumber={documentNumber} />
            )}
            {normalizedMode === "creditnote" && (
                <CreditNotePreview {...sharedProps} documentNumber={documentNumber} />
            )}
            {normalizedMode === "creditreceipt" && (
                <CreditNotePreview
                    {...sharedProps}
                    documentNumber={documentNumber}
                    documentType="creditreceipt"
                />
            )}
            {normalizedMode === "debitnote" && (
                <DebitNotePreview {...sharedProps} documentNumber={documentNumber} />
            )}
            {normalizedMode === "statement" && (
                <StatementPreview
                    {...sharedProps}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            )}
            {normalizedMode === "proforma" && (
                <ProformaPreview
                    {...sharedProps}
                    documentNumber={documentNumber}
                    collapseUnits={collapseUnits}
                />
            )}
        </div>
    );
}

export default withPrintLog(printContext, CityLedgerPrintingPages);
