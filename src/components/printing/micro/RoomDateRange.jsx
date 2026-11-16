import { getI18n } from "@/lib/printing-i18n";
import DirectionalArrow from "./DirectionalArrow";

export default function RoomDateRange({ room, mode }) {
    const { t, formatDate } = getI18n();
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                {formatDate(room.from_date)}
                <DirectionalArrow />
                {formatDate(room.to_date)}
            </div>
            {mode === "printing" && room.departure_time?.description && (
                <p>({t("Lcz_ExpectedDeparture_X", room.departure_time.description)})</p>
            )}
        </div>
    );
}
