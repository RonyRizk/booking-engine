import InfoDisplay from "@/components/InfoDisplay";

export default function DocumentNumberLine({ mode, documentId, receiptNumber, selectedDocument }) {
    if (mode === "invoice") {
        return <InfoDisplay className={""} label={"Invoice no.:"} value={documentId} />;
    }
    if (mode === "creditnote") {
        return (
            <>
                <InfoDisplay className={""} label={"Credit note no.:"} value={selectedDocument?.credit_note?.nbr} />
                <InfoDisplay className={""} label={"Original invoice no.:"} value={documentId} />
            </>
        );
    }
    if (mode === "receipt") {
        return <InfoDisplay className={""} label={"Receipt no.:"} value={receiptNumber} />;
    }
    return null;
}
