import InfoDisplay from "@/components/InfoDisplay";

export default function RoomGuestOccupancy({ room, booking, locales, mode, printingService }) {
    return (
        <div className="flex items-center gap-4">
            <InfoDisplay
                label={`${locales?.Lcz_GuestName}:`}
                value={printingService.formatGuestName(
                    room.sharing_persons?.find(p => p.is_main) ?? room?.guest
                )}
            />
            <InfoDisplay
                label={``}
                asHtml
                value={printingService.formatGuestAvailability(room?.occupancy, locales)}
            />
            {mode !== "invoice" && room.bed_preference && (
                <InfoDisplay
                    label={``}
                    value={`(${printingService.getBedLabel({
                        language: booking.language,
                        bed_preference: room.bed_preference,
                    })})`}
                />
            )}
        </div>
    );
}
