import InfoDisplay from "@/components/InfoDisplay";

export default function BilledToName({ selectedDocument, formattedGuestName, isInvoicableMode, companyName }) {
    if (isInvoicableMode && selectedDocument?.billed_to_name) {
        return (
            <>
                <InfoDisplay label={``} value={selectedDocument.billed_to_name} />
                <InfoDisplay
                    label={``}
                    asHtml
                    value={`<span style="font-weight:bold">for</span> ${formattedGuestName}`}
                />
            </>
        );
    }
    return (
        <>
            {companyName && <InfoDisplay label="Company:" value={companyName} />}
            <InfoDisplay label={`Name:`} value={formattedGuestName} />
        </>
    );
}
