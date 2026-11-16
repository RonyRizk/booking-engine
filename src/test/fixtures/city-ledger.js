import { createElement } from "react";
import { printableBooking, withFdLanguage } from "@/test/fixtures/printing";
import { installFakeGateway } from "@/test/helpers/fake-gateway";
import { renderServer } from "@/test/helpers/render";

export const AGENT_ID = "227";

/** The agent the documents are billed to, as Get_Exposed_Agent returns it. */
export const agent = () => ({ id: 227, name: "Acme Travel", tax_nbr: "AC-55", city: "Paris", country_id: 9, rt_namings: [] });

const night = (SERVICE_DATE, NET_AMOUNT) => ({
    CL_TX_ID: Number(SERVICE_DATE.replaceAll("-", "")), CL_TX_TYPE_CODE: "DB", DOC_NUMBER: "INV-19",
    BOOK_NBR: "80347800505", BSA_REF: "BSA-1", PR_ID: 101, ROOM_CATEGORY_ID: 11, ROOM_TYPE_ID: 11, RATE_PLAN_ID: 3,
    FROM_DATE: "2026-01-05", TO_DATE: "2026-01-07", SERVICE_DATE, DESCRIPTION: "Deluxe Room",
    ADULTS_NBR: 2, CHILD_NBR: 0, INFANT_NBR: 0, GUEST_FIRST_NAME: "Marie", GUEST_LAST_NAME: "Curie",
    NET_AMOUNT, VAT_PERCENT: 11, VAT_AMOUNT: NET_AMOUNT * 0.11, TAX_AMOUNT: NET_AMOUNT * 0.11, CITY_TAX_PERCENT: 0, CITY_TAX_AMOUNT: 0,
    TOTAL_AMOUNT: NET_AMOUNT * 1.11, REL_ENTITY: "TBL_BSA", REL_ENTITY_KEY: 1,
});

/** The ledger lines of invoice INV-19: two nights and a spa service sold against the room. */
export const invoiceTransactions = () => [
    night("2026-01-05", 100),
    night("2026-01-06", 100),
    {
        ...night("2026-01-06", 30), CL_TX_ID: 3, PR_ID: null, DESCRIPTION: "001: Spa access",
        REL_ENTITY: "TBL_BSE", VAT_AMOUNT: 3.3, TAX_AMOUNT: 3.3, TOTAL_AMOUNT: 33.3,
    },
];

/** The agent's payment REC-4, as a ledger line. */
export const paymentTransaction = () => ({
    CL_TX_ID: 9, CL_TX_TYPE_CODE: "PAY", DOC_NUMBER: "REC-4", SERVICE_DATE: "2026-01-10",
    TOTAL_AMOUNT: 300, PAY_METHOD_CODE: "001", DESCRIPTION: "Wire 4471",
});

const fd = (FD_TYPE_CODE, FD_TYPE_NAME, DOC_NUMBER, ISSUE_DATE, extra = {}) => ({
    FD_ID: DOC_NUMBER, FD_TYPE_CODE, FD_TYPE_NAME, DOC_NUMBER, ISSUE_DATE, ISSUE_DATE_DISPLAY: null, CURRENCY_CODE: "USD", ...extra,
});

/** The agent's fiscal documents, as Get_Fiscal_Documents returns them. */
export const fiscalDocuments = () => [
    fd("INV", "Invoice", "INV-19", "2026-01-08", { DEBIT: 255.3, CREDIT: 0, NET_AMOUNT: 230, TAX_AMOUNT: 25.3, TOTAL_AMOUNT: 255.3 }),
    fd("REC", "Receipt", "REC-4", "2026-01-10", { DEBIT: 0, CREDIT: 300, TOTAL_AMOUNT: 300, BALANCE_BEFORE_TX: 355.3, BALANCE_AFTER_TX: 55.3 }),
    fd("CN", "Credit Note", "CN-2", "2026-01-12", { DEBIT: 0, CREDIT: 50, NET_AMOUNT: 45, TAX_AMOUNT: 5, TOTAL_AMOUNT: 50, EXTERNAL_REF: "INV-19" }),
    fd("DN", "Debit Note", "DN-1", "2026-01-14", { DEBIT: 20, CREDIT: 0, NET_AMOUNT: 18, TAX_AMOUNT: 2, TOTAL_AMOUNT: 20, EXTERNAL_REF: "INV-19" }),
    fd("CREC", "Credit Receipt", "CREC-1", "2026-01-15", { DEBIT: 10, CREDIT: 0, TOTAL_AMOUNT: 10, EXTERNAL_REF: "REC-4" }),
];

/** The agent's _PAY_METHOD setup rows. */
export const paymentMethods = [
    { CODE_NAME: "001", CODE_VALUE_EN: "Cash", CODE_VALUE_FR: "Espèces", CODE_VALUE_AR: "نقدًا" },
    { CODE_NAME: "007", CODE_VALUE_EN: "Bank transfer", CODE_VALUE_FR: "Virement bancaire" },
];

/** Answers every gateway call the city ledger page makes. */
export const installCityLedgerGateway = ({ labels, transactions = invoiceTransactions(), documents = fiscalDocuments(), statement = { STARTING_BALANCE: 100, ENDING_BALANCE: 325.3 }, editBooking = () => {}, lang = "en", results = {} } = {}) => {
    const { property: baseProperty, booking } = printableBooking();
    editBooking(booking);
    const property = withFdLanguage({ ...baseProperty, currency: { id: 4, code: "USD", symbol: "US$" } }, lang);
    return {
        property,
        booking,
        gateway: installFakeGateway({
            "/Get_Exposed_Property": property,
            "/Get_Exposed_Agent": agent(),
            "/Get_Exposed_Countries": [{ id: 9, name: "France" }],
            "/Get_Exposed_Language": labels,
            "/Get_Setup_Entries_By_TBL_NAME_Multi": [{ TBL_NAME: "_SVC_CATEGORY", CODE_NAME: "001", CODE_VALUE_EN: "Wellness", CODE_VALUE_FR: "Bien-être" }],
            "/Get_Setup_Entries_By_TBL_NAME": paymentMethods,
            "/Fetch_CL": (body) => ({ My_Cl_tx: [...transactions, paymentTransaction()].filter((tx) => !body.SEARCH_QUERY || tx.DOC_NUMBER === body.SEARCH_QUERY || tx.BOOK_NBR === body.SEARCH_QUERY) }),
            "/Get_Fiscal_Documents": (body) => ({ My_Rows: documents.filter((d) => !body.DOC_NUMBER || d.DOC_NUMBER === body.DOC_NUMBER) }),
            "/Get_CL_Statement": statement,
            "/Get_Exposed_Booking": booking,
            ...results,
        }),
    };
};

/** Renders the city ledger page and returns its HTML. */
export const renderCityLedger = (Page, searchParams) =>
    renderServer(createElement(Page, { params: { domain: "a35.bookingmystay.com", id: "a35" }, searchParams: { token: "token", aid: AGENT_ID, ...searchParams } }));
