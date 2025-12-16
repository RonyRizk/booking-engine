/* eslint-disable @next/next/no-img-element */
import InfoDisplay from "@/components/InfoDisplay";
import { format, parse } from "date-fns";
import { cn, formatTime } from "@/lib/utils";
import CompanyInfo from "./CompanyInfo";
import PropertyInfo from "./PropertyInfo";
import PrintInfo from "./PrintInfo";
import GuestInformation from "./GuestInformation";

export default function PrintingHeader({ booking, property, locales, documentId, receiptNumber, mode, guestCountryName, totalPersons, printingService, privateNote, selectedDocument }) {
    if (["receipt", "invoice", "creditnote"].includes(mode.toLowerCase().toString())) {
        const getTitle = () => {
            switch (mode) {
                case "receipt":
                    return "Receipt";
                case "invoice":
                    return "Invoice";
                case "creditnote":
                    return "Credit Note";
                default:
                    return "";
            }
        }
        return (
            <header className={cn("p-4 sm:px-6 lg:px-8 text-gray-800  text-sm max-w-4xl mx-auto",)}>
                <h3 className="text-3xl font-bold mb-4">{getTitle()}</h3>
                <nav className="flex gap-4 flex-col-reverse sm:flex-row sm:justify-between sm:w-full">
                    <div className="space-y-4">
                        <PrintInfo selectedDocument={selectedDocument} receiptNumber={receiptNumber} documentId={documentId} mode={mode} booking={booking} />
                        <GuestInformation
                            booking={booking}
                            selectedDocument={selectedDocument}
                            guestCountryName={guestCountryName}
                            totalPersons={totalPersons}
                            locales={locales}
                            printingService={printingService}
                            mode={mode}
                            privateNote={privateNote}
                        />
                    </div>
                    <div className="space-y-2.5">
                        <CompanyInfo company={property.company} />

                        <PropertyInfo property={property} />

                    </div>
                </nav>
            </header>
        )
    }

    return (
        <header className="px-4 pt-4 sm:px-6 lg:px-8 text-gray-800 py-0 text-sm max-w-4xl mx-auto">
            <nav className="flex flex-col-reverse sm:flex-row sm:justify-between sm:w-full">
                <div>
                    <img
                        src={property.space_theme.logo}
                        alt="logo"
                        className="aspect-1 h-14 hidden mb-2.5 sm:block"
                    />
                    <InfoDisplay
                        label={`${locales?.Lcz_Address}:`}
                        value={[
                            property?.address ?? null,
                            property?.city.name ?? null,
                            property?.country.name ?? null,
                        ]
                            .filter((f) => f !== null)
                            .join(", ")}
                    />
                    <InfoDisplay
                        label={`${locales?.Lcz_Phone}:`}
                        value={`+${property?.country?.phone_prefix.replace("+", "") + " -" || ""} ${property?.phone}`}
                    />
                </div>
                <div>
                    <p className="text-xl text-gray-900">{locales?.Lcz_Booking}#{booking?.is_direct ? booking?.booking_nbr : booking?.booking_nbr}</p>
                    {!booking.is_direct && <p className="sm:text-end text-xl">{booking.channel_booking_nbr}</p>}
                    <div className={"flex items-center sm:justify-end"}>
                        <p className="booked_on_date">
                            {format(
                                parse(booking?.booked_on.date, "yyyy-MM-dd", new Date()),
                                "dd-MMM-yyyy"
                            )}{" "}
                            {formatTime(
                                booking?.booked_on.hour.toString(),
                                booking?.booked_on.minute.toString()
                            )}
                        </p>
                        <img
                            src={booking?.origin.Icon}
                            alt={booking?.origin.Label}
                            className="size-6 aspect-1 ml-2"
                        />
                    </div>
                    {booking.agent && <div className="flex flex-col sm:items-end">
                        <InfoDisplay label={`Agent:`} value={booking.agent.name} />
                    </div>}
                    <div className="flex flex-col sm:items-end">
                        <InfoDisplay label={``} value={property?.registered_name} />
                        {mode === "invoice" && property?.tax_nbr && (
                            <InfoDisplay label={`${locales?.Lcz_TaxID}:`} value={property?.tax_nbr} />
                        )}
                    </div>

                </div>
            </nav>
            <section className="pb-4">
                {<div className="flex items-center w-full justify-between flex-wrap">
                    <p className="property_name">{property?.name}</p>
                    {mode === "invoice" && <div>
                        <InfoDisplay
                            label={`${locales?.Lcz_InvoiceReference}:`}
                            value={booking?.financial.invoice_nbr}
                        />
                    </div>}
                </div>}
            </section>
        </header>
    );

}
