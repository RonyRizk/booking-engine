import { getI18n } from "@/lib/printing-i18n";
import InfoDisplay from "@/components/InfoDisplay";

export default function RegisteredNameTaxLine({ property, mode }) {
    const { t } = getI18n();
    return (
        <div className="flex flex-col sm:items-end">
            {/* <InfoDisplay label={``} value={property?.registered_name} /> */}
            {mode === "invoice" && property?.tax_nbr && (
                <InfoDisplay label={`${t("Lcz_TaxID")}:`} value={property?.tax_nbr} />
            )}
        </div>
    );
}
