import InfoDisplay from "@/components/InfoDisplay";
import { getI18n } from "@/lib/printing-i18n";

export default function BilledToName({ selectedDocument, formattedGuestName, isInvoicableMode, companyName }) {
    const { t } = getI18n();
    if (isInvoicableMode && selectedDocument?.billed_to_name) {
        return (
            <>
                <InfoDisplay label={``} value={selectedDocument.billed_to_name} />
                <InfoDisplay label={``} value={t("Lcz_For_X", formattedGuestName)} />
            </>
        );
    }
    return (
        <>
            {companyName && <InfoDisplay label={`${t("Lcz_Company")}:`} value={companyName} />}
            <InfoDisplay label={`${t("Lcz_Name")}:`} value={formattedGuestName} />
        </>
    );
}
