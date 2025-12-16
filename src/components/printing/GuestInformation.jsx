import InfoDisplay from "@/components/InfoDisplay";

export default function GuestInformation({ booking, selectedDocument, guestCountryName, totalPersons, locales, printingService, mode, privateNote }) {
    const isInvoicableMode = ["invoice", "creditnote"].includes(mode)
    if (isInvoicableMode && selectedDocument?.target?.code === "002") {
        return <section className={"justify-start flex flex-col"}>
            <h3 className="font-bold">Bill to</h3>
            <div>
                <InfoDisplay
                    label={``}
                    value={booking?.company_name}
                />
                <InfoDisplay
                    label={``}
                    value={booking?.company_tax_nbr}
                />
            </div>
        </section>
    }
    const formattedGuestName = printingService.formatGuestName(booking?.guest)
    return (
        <section className={mode === "printing" ? "py-4 border-y border-gray-300 justify-start flex" : "justify-start flex"}>
            <div className="flex-1">
                {mode !== "printing" && <div>
                    <h3 className="font-bold">{isInvoicableMode ? "Bill to" : "From"}</h3>
                </div>}
                {isInvoicableMode && selectedDocument?.billed_to_name && <InfoDisplay
                    label={``}
                    value={selectedDocument?.billed_to_name}
                />}
                {/* <InfoDisplay
                    label={`${locales?.Lcz_BookedBy}:`}
                    value={`${printingService.formatGuestName(
                        booking?.guest
                    )} - ${totalPersons} ${totalPersons > 1 ? locales?.Lcz_Persons : locales?.Lcz_Person}`}
                /> */}
                <InfoDisplay
                    label={``}
                    asHtml
                    value={isInvoicableMode && selectedDocument?.billed_to_name ? `<span style="font-weight:bold">for</span> ${formattedGuestName}` : formattedGuestName}
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
                {mode === "printing" && <InfoDisplay
                    label={`${locales?.Lcz_ArrivalTime}:`}
                    value={booking?.arrival?.description}
                />}
                {mode === "printing" && (
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
            {mode === "printing" && <p className="text-gray-900 text-lg font-semibold">
                {booking.status.description}
            </p>}
        </section>
    );
} 
