import InfoDisplay from "@/components/InfoDisplay";

export default function RegisteredNameTaxLine({ property, locales, mode }) {
    return (
        <div className="flex flex-col sm:items-end">
            {/* <InfoDisplay label={``} value={property?.registered_name} /> */}
            {mode === "invoice" && property?.tax_nbr && (
                <InfoDisplay label={`${locales?.Lcz_TaxID}:`} value={property?.tax_nbr} />
            )}
        </div>
    );
}
