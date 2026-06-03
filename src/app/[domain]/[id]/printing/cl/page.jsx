import { redirect } from "next/navigation";
import { CityLedgerService } from "@/lib/services/city-ledger.service";
import { BookingService } from "@/lib/services/booking.service";
import { InvoicePreview } from "./components/invoice-preview";
import { ReceiptPreview } from "./components/receipt-preview";
import { CreditNotePreview } from "./components/credit-note-preview";
import { DebitNotePreview } from "./components/debit-note-preview";
import { StatementPreview } from "./components/statement-preview";
import { ProformaPreview } from "./components/proforma-preview";
import "./cl-printing.css";
import { CommonServices } from "@/lib/services/common.service";
import { FdTypes } from "@/lib/enums";
import { convertBookingToCL } from "./utils/booking-to-cl";

const DEFAULT_BASE_URL = "https://gateway.igloorooms.com/IR";
const VALID_MODES = new Set([
    "invoice",
    "receipt",
    "creditnote",
    "debitnote",
    "statement",
    "draft",
    "proforma",
]);
const FD_TYPES = [FdTypes.CreditNote, FdTypes.DebitNote, FdTypes.Invoice];
const FALLBACK_URL = "https://x.igloorooms.com/manage/acbookinglist.aspx";

/**
 * Per-mode secondary fetchers. Called after property is resolved so they have
 * access to `property.id`, `property.currency.id`, etc.
 * Add a new entry here when introducing a new mode.
 *
 * @type {Record<string, (cl: CityLedgerService, property: object, params: object) => Promise<object>>}
 */
const FETCHERS = {
    invoice: (cl, _property, { agentId, documentNumber }) =>
        cl
            .fetchCL({ AGENCY_ID: agentId, SEARCH_QUERY: documentNumber })
            .then((result) => ({ transactions: result?.My_Result?.My_Cl_tx ?? [] })),
    draft: (cl, _property, { agentId, documentNumber }) =>
        cl
            .fetchCL({ AGENCY_ID: agentId, SEARCH_QUERY: documentNumber })
            .then((result) => ({ transactions: result?.My_Result?.My_Cl_tx ?? [] })),

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
        { agentId, fromDate, toDate, bookingId, token, lang },
    ) => {
        const commonService = new CommonServices(DEFAULT_BASE_URL);
        commonService.setToken(token);
        if (bookingId) {
            const bookingService = new BookingService(DEFAULT_BASE_URL);
            bookingService.setToken(token);
            const [clResult, booking, setupEntries] = await Promise.all([
                cl.fetchCL({
                    AGENCY_ID: agentId,
                    SEARCH_QUERY: bookingId,
                    FROM_DATE: null,
                    TO_DATE: null,
                }),
                bookingService.getExposedBooking({
                    booking_nbr: bookingId,
                    language: lang,
                    is_get_financial_snapshot: true,
                    extras: [
                        {
                            key: "payment_code",
                            value: "",
                        },
                    ],
                }),
                commonService.getSetupEntriesByTBLNameMulti(["_SVC_CATEGORY"], "en"),
            ]);
            const clTxs = clResult?.My_Result?.My_Cl_tx ?? [];
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

        return { transactions: clResult?.My_Result?.My_Cl_tx ?? [] };
    },

    statement: (cl, property, { agentId, fromDate, toDate }) => {
        const currencyId = property?.currency?.id;
        return Promise.all([
            cl.getCLStatement({
                AGENCY_ID: agentId,
                CURRENCY_ID: currencyId,
                START_DATE: fromDate,
                END_DATE: toDate,
            }),
            cl.getFiscalDocuments({
                AGENCY_ID: agentId,
                START_DATE: fromDate,
                END_DATE: toDate,
                LIST_FD_TYPE_CODE: FD_TYPES,
            }),
        ]).then(([statement, fiscalDocuments]) => ({
            statement,
            fiscalDocuments: fiscalDocuments?.My_Rows ?? [],
        }));
    },
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
 * @param {("invoice"|"receipt"|"creditnote"|"debitnote"|"statement")} props.searchParams.mode - Document mode (required).
 * @param {string}  props.searchParams.aid   - Agent ID (required).
 * @param {string}  [props.searchParams.docNo] - Document number (invoice / receipt / credit-debit note).
 * @param {string}  [props.searchParams.from]  - Statement start date (YYYY-MM-DD).
 * @param {string}  [props.searchParams.to]    - Statement end date (YYYY-MM-DD).
 * @param {string}  [props.searchParams.ref]   - External reference (credit note).
 */
export default async function CityLedgerPrintingPages({
    searchParams,
    params,
}) {
    const {
        token,
        mode,
        aid: agentId,
        docNo: documentNumber,
        from: fromDate,
        to: toDate,
        ref: externalRef,
        id: bookingId,
        lang = "en",
    } = searchParams;

    const normalizedMode = mode?.toLowerCase()?.trim();

    if (
        !token ||
        !normalizedMode ||
        !agentId ||
        !VALID_MODES.has(normalizedMode)
    ) {
        redirect(FALLBACK_URL);
    }

    const cl = new CityLedgerService();
    cl.setToken(token);

    const commonService = new CommonServices();
    commonService.setToken(token);
    commonService.setBaseUrl(DEFAULT_BASE_URL);

    // Phase 1 — resolve property, agent, and countries in parallel
    let property;
    let agent;
    let countries;
    try {
        [property, agent, countries] = await Promise.all([
            commonService.getExposedProperty(params.id, lang),
            cl.getExposedAgent({ id: agentId }),
            commonService.getCountries(lang),
        ]);
        if (agent && agent.country_id) {
            const countryEntry = countries?.find((c) => c.id === agent.country_id);
            agent = { ...agent, countryName: countryEntry?.name ?? null };
        }
    } catch (error) {
        // redirect(FALLBACK_URL);
        console.log(error);
        return <span>something went wrong! {JSON.stringify(error)}</span>;
    }
    // Phase 2 — fetch mode-specific data in parallel

    let modeData;
    try {
        modeData = await FETCHERS[normalizedMode](cl, property, {
            agentId,
            documentNumber,
            fromDate,
            toDate,
            externalRef,
            bookingId,
            token,
            lang,
        });
    } catch (error) {
        console.log(error);
        return <span>something went wrong! {JSON.stringify(error)}</span>;
        //redirect(FALLBACK_URL);
    }
    // const agent = property?.agents?.find(a => Number(a.id) === Number(agentId)) ?? null;
    const sharedProps = { property, agent, ...modeData };
    return (
        <div className="min-h-screen bg-white">
            {["invoice", "draft"].includes(normalizedMode) && (
                <InvoicePreview
                    isDraft={normalizedMode === "draft"}
                    {...sharedProps}
                    documentNumber={documentNumber}
                />
            )}
            {normalizedMode === "receipt" && (
                <ReceiptPreview {...sharedProps} documentNumber={documentNumber} />
            )}
            {normalizedMode === "creditnote" && (
                <CreditNotePreview {...sharedProps} documentNumber={documentNumber} />
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
                <ProformaPreview {...sharedProps} documentNumber={documentNumber} />
            )}
        </div>
    );
}
