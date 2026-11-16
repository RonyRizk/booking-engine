import InfoDisplay from "@/components/InfoDisplay";
import { getI18n } from "@/lib/printing-i18n";

export default function PickupArrivalRow({ pickup_info }) {
    const { t, formatDate, formatTime } = getI18n();
    return (
        <div className="flex items-center gap-1.5 sm:gap-4 flex-wrap">
            <InfoDisplay
                label={`${t("Lcz_ArrivalDate")}:`}
                value={formatDate(pickup_info.date)}
            />
            <InfoDisplay
                label={`${t("Lcz_ArrivalTime")}:`}
                value={formatTime(pickup_info.hour, pickup_info.minute)}
            />
            <InfoDisplay
                label={`${t("Lcz_FlightDetails")}:`}
                value={pickup_info.details}
            />
        </div>
    );
}
