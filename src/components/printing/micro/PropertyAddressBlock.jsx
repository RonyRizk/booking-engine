import { formatPropertyPhone } from "@/lib/utils";
import { getI18n } from "@/lib/printing-i18n";
import InfoDisplay from "@/components/InfoDisplay";

export default function PropertyAddressBlock({ property }) {
    const { t } = getI18n();
    const address = [property?.address ?? null, property?.city.name ?? null, property?.country.name ?? null]
        .filter(f => f !== null)
        .join(", ");
    return (
        <div>
            <InfoDisplay label={`${t("Lcz_Address")}:`} value={address} />
            <InfoDisplay
                label={`${t("Lcz_Phone")}:`}
                value={formatPropertyPhone(property)}
            />
        </div>
    );
}
