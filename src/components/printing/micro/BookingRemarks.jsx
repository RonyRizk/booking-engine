import InfoDisplay from "@/components/InfoDisplay";

export default function BookingRemarks({ booking, locales, privateNote }) {
    return (
        <>
            {booking?.guest?.notes && (
                <div>
                    <InfoDisplay inline label={`Guest Notes:`} value={booking.guest.notes} />
                </div>
            )}
            {booking.remark && booking.is_direct && (
                <div>
                    <InfoDisplay
                        inline
                        asHtml
                        label={`Channel ${locales?.Lcz_Notes ?? "Notes"}:`}
                        value={booking.remark}
                    />
                </div>
            )}
            {booking.ota_notes && !booking.is_direct && (
                <InfoDisplay
                    inline
                    label={`${locales?.Lcz_GuestRemark ?? "Guest Notes"}:`}
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
