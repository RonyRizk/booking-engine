/* eslint-disable @next/next/no-img-element */
import InfoDisplay from "@/components/InfoDisplay";
import { format, parse } from "date-fns";
import { formatTime } from "@/lib/utils";

export default function PrintingHeader({ booking, property, locales, mode }) {
    return (
        <header className="px-4 pt-4 sm:px-6 lg:px-8 text-gray-800 py-0 text-sm max-w-4xl mx-auto">
            <nav className="flex flex-col-reverse md:flex-row md:justify-between md:w-full">
                <div>
                    <img
                        src={property.space_theme.logo}
                        alt="logo"
                        className="aspect-1 h-14 hidden mb-2.5 md:block"
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
                    {!booking.is_direct && <p className="md:text-end text-xl">{booking.channel_booking_nbr}</p>}
                    <div className={"flex items-center md:justify-end"}>
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
                    <div className="flex flex-col md:items-end">
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
