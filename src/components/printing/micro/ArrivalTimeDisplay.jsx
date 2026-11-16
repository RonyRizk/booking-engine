import { getI18n } from "@/lib/printing-i18n";
import InfoDisplay from "@/components/InfoDisplay";

export default function ArrivalTimeDisplay({ booking }) {
    const { t } = getI18n();
    return (
        <InfoDisplay
            label={`${t("Lcz_ArrivalTime")}:`}
            value={booking?.arrival?.description}
        />
    );
}
