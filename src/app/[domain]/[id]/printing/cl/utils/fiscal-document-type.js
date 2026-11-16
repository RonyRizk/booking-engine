import { FdTypes } from "@/lib/enums";

const TYPE_LABELS = {
    [FdTypes.Invoice]: "Lcz_Invoice",
    [FdTypes.Receipt]: "Lcz_Receipt",
    [FdTypes.CreditNote]: "Lcz_CreditNote",
    [FdTypes.DebitNote]: "Lcz_DebitNote",
    [FdTypes.CreditReceipt]: "Lcz_CreditReceipt",
};

/**
 * The name of a fiscal document type in the document's language. The gateway's
 * FD_TYPE_NAME is English only, so it is used just for codes this map doesn't know.
 *
 * @param {{ FD_TYPE_CODE?: string, FD_TYPE_NAME?: string }} doc
 * @param {(key: string, ...args: unknown[]) => string} t
 */
export function fiscalDocumentTypeLabel(doc, t) {
    if (doc?.FD_TYPE_CODE === FdTypes.Draft) return t("Lcz_X_Draft", t("Lcz_Invoice"));
    const key = TYPE_LABELS[doc?.FD_TYPE_CODE];
    return key ? t(key) : doc?.FD_TYPE_NAME;
}
