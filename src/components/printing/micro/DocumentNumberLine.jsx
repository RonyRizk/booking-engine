import InfoDisplay from "@/components/InfoDisplay";
import { getI18n } from "@/lib/printing-i18n";

export default function DocumentNumberLine({ mode, documentId, receiptNumber, selectedDocument }) {
    const { t } = getI18n();
    if (mode === "invoice") {
        return <InfoDisplay className={""} label={`${t("Lcz_InvoiceNo")}:`} value={documentId} />;
    }
    if (mode === "creditnote") {
        return (
            <>
                <InfoDisplay className={""} label={`${t("Lcz_CreditNoteNo")}:`} value={selectedDocument?.credit_note?.nbr} />
                <InfoDisplay className={""} label={"Original invoice no.:"} value={documentId} />
            </>
        );
    }
    if (mode === "receipt") {
        return <InfoDisplay className={""} label={`${t("Lcz_ReceiptNo")}:`} value={receiptNumber} />;
    }
    return null;
}
