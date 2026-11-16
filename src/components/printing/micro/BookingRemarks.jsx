import InfoDisplay from "@/components/InfoDisplay";
import { getI18n } from "@/lib/printing-i18n";

export default function BookingRemarks({ booking, privateNote }) {
    const { t } = getI18n();
    return (
        <>
            {booking?.guest?.notes && (
                <div>
                    <InfoDisplay inline label={`${t("Lcz_GuestNotes")}:`} value={booking.guest.notes} />
                </div>
            )}
            {booking.remark && booking.is_direct && (
                <div>
                    <InfoDisplay
                        inline
                        asHtml
                        label={`${t("Lcz_ChannelNotes")}:`}
                        value={booking.remark}
                    />
                </div>
            )}
            {booking.ota_notes && !booking.is_direct && (
                <InfoDisplay
                    inline
                    label={`${t("Lcz_GuestRemark")}:`}
                    value={booking.ota_notes?.map(notes => (
                        <span key={`ota_note_${notes.statement}`} className="text-gray-600">
                            {notes.statement}
                        </span>
                    ))}
                />
            )}
            {privateNote && (
                <div>
                    <InfoDisplay inline label={``} value={privateNote.value} />
                </div>
            )}
        </>
    );
}
