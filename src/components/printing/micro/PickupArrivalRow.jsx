import InfoDisplay from "@/components/InfoDisplay";
import moment from "moment";
import { formatTime } from "@/lib/utils";

export default function PickupArrivalRow({ pickup_info, locales }) {
    return (
        <div className="flex items-center gap-1.5 sm:gap-4 flex-wrap">
            <InfoDisplay
                label={`${locales?.Lcz_ArrivalDate}:`}
                value={moment(pickup_info.date).locale("en").format("dddd, DD MMM YYYY")}
            />
            <InfoDisplay
                label={`${locales?.Lcz_ArrivalTime}:`}
                value={formatTime(pickup_info.hour.toString(), pickup_info.minute.toString())}
            />
            <InfoDisplay
                label={`${locales?.Lcz_FlightDetails}:`}
                value={pickup_info.details}
            />
        </div>
    );
}
