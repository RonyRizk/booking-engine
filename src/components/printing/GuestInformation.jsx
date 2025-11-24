import InfoDisplay from "@/components/InfoDisplay";

export default function GuestInformation({ booking, guestCountryName, totalPersons, locales, printingService, mode, privateNote }) {
    return (
        <section className={mode === "receipt" ? "justify-start flex" : "py-4 border-y border-gray-300 justify-start flex"}>
            <div className="flex-1">
                {mode === "receipt" && <div>
                    <h3 className="font-bold">From</h3>
                </div>}
                {/* <InfoDisplay
                    label={`${locales?.Lcz_BookedBy}:`}
                    value={`${printingService.formatGuestName(
                        booking?.guest
                    )} - ${totalPersons} ${totalPersons > 1 ? locales?.Lcz_Persons : locales?.Lcz_Person}`}
                /> */}
                <InfoDisplay
                    label={``}
                    value={`${printingService.formatGuestName(
                        booking?.guest
                    )}`}
                />
                {/* <InfoDisplay label={`${locales?.Lcz_Email}:`} value={booking?.guest?.email} /> */}
                <InfoDisplay label={``} value={booking?.guest?.email} />
                {/* <InfoDisplay
                    label={`${locales?.Lcz_Phone}:`}
                    value={printingService.formatPhoneNumber(
                        booking?.guest,
                        booking?.is_direct
                    )}
                /> */}
                <InfoDisplay
                    label={``}
                    value={printingService.formatPhoneNumber(
                        booking?.guest,
                        booking?.is_direct
                    )}
                />
                {guestCountryName && (
                    // <InfoDisplay label={`${locales?.Lcz_Country}:`} value={guestCountryName} />
                    <InfoDisplay label={``} value={guestCountryName} />
                )}
                {mode === "printing" && booking?.guest?.notes && (
                    <div>
                        <InfoDisplay inline={true} label={`Guest Notes:`} value={booking?.guest?.notes} />
                    </div>
                )}
                {mode !== "receipt" && <InfoDisplay
                    label={`${locales?.Lcz_ArrivalTime}:`}
                    value={booking?.arrival?.description}
                />}
                {mode !== "invoice" && (
                    <>
                        {booking.remark && booking.is_direct && (
                            <div>
                                <InfoDisplay inline={true} label={`${locales?.Lcz_GuestRemark ?? "Guest Notes"}:`} value={booking.remark} />
                            </div>
                        )}
                        {booking.ota_notes && !booking.is_direct && (
                            <div className="flex items-start gap-1 flex-grow">
                                <p className="font-medium text-gray-900">Channel {locales?.Lcz_Notes ?? "Notes"}:</p>
                                <div>
                                    {booking.ota_notes?.map((notes) => (
                                        <p key={`ota_note_${notes.statement}`} className="text-gray-600">
                                            {notes.statement}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                        {privateNote && mode === "printing" && (
                            <div>
                                {/* <InfoDisplay inline={true} label={`${locales?.Lcz_BookingPrivateNote}:`} value={privateNote.value} /> */}
                                <InfoDisplay inline={true} label={``} value={privateNote.value} />
                            </div>
                        )}
                    </>
                )}
            </div>
            {mode !== "receipt" && <p className="text-gray-900 text-lg font-semibold">
                {booking.status.description}
            </p>}
        </section>
    );
} 
