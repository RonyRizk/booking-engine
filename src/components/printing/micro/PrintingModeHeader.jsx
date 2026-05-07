/* eslint-disable @next/next/no-img-element */
import InfoDisplay from "@/components/InfoDisplay";
import BookingNumberDisplay from "./BookingNumberDisplay";
import BookedOnTimestamp from "./BookedOnTimestamp";
import PropertyAddressBlock from "./PropertyAddressBlock";
import RegisteredNameTaxLine from "./RegisteredNameTaxLine";
import BookingSourceLine from "./BookingSourceLine";

export default function PrintingModeHeader({ booking, property, locales, mode, agent }) {
    return (
        <header className="px-4 pt-4 sm:px-6 lg:px-8 text-gray-800 py-0 text-sm max-w-4xl mx-auto">
            <nav className="flex flex-col-reverse sm:flex-row sm:justify-between sm:w-full">
                <div>
                    <img
                        src={property.space_theme.logo}
                        alt="logo"
                        className="aspect-1 h-14 hidden mb-2.5 sm:block"
                    />
                    {/* <PropertyAddressBlock property={property} locales={locales} /> */}
                </div>
                <div>
                    <BookingNumberDisplay booking={booking} locales={locales} />
                    <BookingSourceLine booking={booking} agent={agent} />
                    <BookedOnTimestamp booking={booking} />
                    <RegisteredNameTaxLine property={property} locales={locales} mode={mode} />
                </div>
            </nav>
            <section className="pb-4">
                <div className="flex items-center w-full justify-between flex-wrap">
                    <p className="property_name">{property?.name}</p>
                    {mode === "invoice" && (
                        <div>
                            <InfoDisplay
                                label={`${locales?.Lcz_InvoiceReference}:`}
                                value={booking?.financial.invoice_nbr}
                            />
                        </div>
                    )}
                </div>
            </section>
        </header>
    );
}
