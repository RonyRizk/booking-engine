import { getI18n } from "@/lib/printing-i18n";
import InfoDisplay from "@/components/InfoDisplay";
import { occupancyLabels } from "@/components/printing/occupancy-labels";

/** The room's guest, occupancy and bed preference; `showGuestName={false}` leaves out the guest. */
export default function RoomGuestOccupancy({ room, booking, mode, bedPreferences, printingService, showGuestName = true }) {
    const { t } = getI18n();
    return (
        <div className="flex items-center gap-4">
            {showGuestName && (
                <InfoDisplay
                    label={`${t("Lcz_GuestName")}:`}
                    value={printingService.formatGuestName(
                        room.sharing_persons?.find(p => p.is_main) ?? room?.guest
                    )}
                />
            )}
            <InfoDisplay
                label={``}
                asHtml
                value={printingService.formatGuestAvailability(room?.occupancy, occupancyLabels(t))}
            />
            {mode !== "invoice" && room.bed_preference && (
                <InfoDisplay
                    label={``}
                    value={`(${printingService.getBedLabel({
                        language: booking.language,
                        bed_preference: room.bed_preference,
                        bed_preferences: bedPreferences,
                    })})`}
                />
            )}
        </div>
    );
}
