export default function RoomHeader({ room, locales, haveMultipleRooms }) {
    return (
        <div className="flex items-center gap-2.5 font-bold text-base mb-1.5 flex-wrap">
            <p>{room.roomtype.name}</p>
            {haveMultipleRooms && room.unit && (
                <p>({locales.Lcz_UnitNbr?.replace('%1', room.unit.name)})</p>
            )}
            <p>{room.rateplan.short_name || room.rateplan.name}</p>
        </div>
    );
}
