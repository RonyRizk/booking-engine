import { getI18n } from "@/lib/printing-i18n";
export default function RoomHeader({ room, haveMultipleRooms }) {
    const { t } = getI18n();
    return (
        <div className="flex items-center gap-2.5 font-bold text-base mb-1.5 flex-wrap">
            <p>{room.roomtype.name}</p>
            {haveMultipleRooms && room.unit && (
                <p>({t("Lcz_UnitNbr", room.unit.name)})</p>
            )}
            <p>{room.rateplan.short_name || room.rateplan.name}</p>
        </div>
    );
}
