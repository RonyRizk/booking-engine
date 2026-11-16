/* eslint-disable @next/next/no-img-element */
import InfoDisplay from "@/components/InfoDisplay";
import { cn, formatPropertyPhone } from "@/lib/utils";
import CompanyInfo from "./CompanyInfo";
import PropertyInfo from "./PropertyInfo";
import PrintInfo from "./PrintInfo";
import GuestInformation from "./GuestInformation";
import { getI18n } from "@/lib/printing-i18n";

export default function PrintingHeader({ booking, property, documentId, receiptNumber, mode, guestCountryName, totalPersons, printingService, className, privateNote, selectedDocument, pid }) {
    const { t, formatDate, formatTime } = getI18n();
    if (["receipt", "invoice", "creditnote", "creditreceipt", "refund", "proforma"].includes(mode.toLowerCase().toString())) {
        const getTitle = () => {
            switch (mode) {
                case "receipt":
                    return t("Lcz_Receipt");
                case "invoice":
                    return t("Lcz_Invoice");
                case "creditnote":
                    return t("Lcz_CreditNote");
                case "creditreceipt":
                case "refund":
                    return t("Lcz_CreditReceipt");
                case "proforma":
                    return t("Lcz_ProformaInvoice");
                default:
                    return "";
            }
        }
        return (
            <header className={cn("w-full max-w-full text-base text-gray-800", className)}>
                <h3 className="text-3xl font-bold mb-[12pt]">{getTitle()}</h3>
                <nav className="flex flex-row justify-between w-full gap-[16pt]">
                    <div className="min-w-0 space-y-[12pt]">
                        <PrintInfo selectedDocument={selectedDocument} receiptNumber={receiptNumber} documentId={documentId} mode={mode} booking={booking} pid={pid} />
                        <GuestInformation
                            booking={booking}
                            selectedDocument={selectedDocument}
                            guestCountryName={guestCountryName}
                            totalPersons={totalPersons}
                            printingService={printingService}
                            mode={mode}
                            privateNote={privateNote}
                        />
                    </div>
                    <div className="min-w-0 shrink-0 space-y-[7pt]">
                        {property.company && <CompanyInfo company={property.company} />}

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
                        alt={t("Lcz_Logo")}
                        className="aspect-1 h-14 hidden mb-2.5 sm:block"
                    />
                    <InfoDisplay
                        label={`${t("Lcz_Address")}:`}
                        value={[
                            property?.address ?? null,
                            property?.city.name ?? null,
                            property?.country.name ?? null,
                        ]
                            .filter((f) => f !== null)
                            .join(", ")}
                    />
                    <InfoDisplay
                        label={`${t("Lcz_Phone")}:`}
                        value={formatPropertyPhone(property)}
                    />
                </div>
                <div>
                    <p className="text-xl text-gray-900">{t("Lcz_Booking")}#{booking?.is_direct ? booking?.booking_nbr : booking?.booking_nbr}</p>
                    {!booking.is_direct && <p className="sm:text-end text-xl">{booking.channel_booking_nbr}</p>}
                    <div className={"flex items-center sm:justify-end"}>
                        <p className="booked_on_date">
                            {formatDate(booking?.booked_on?.date, "dmy")}{" "}
                            {formatTime(booking?.booked_on?.hour, booking?.booked_on?.minute)}
                        </p>
                        <img
                            src={booking?.origin.Icon}
                            alt={booking?.origin.Label}
                            className="size-6 aspect-1 ms-2"
                        />
                    </div>
                    {/* {booking.agent && <div className="flex flex-col sm:items-end">
                        <InfoDisplay label={`Agent:`} value={booking.agent.name} />
                    </div>} */}
                    <div className="flex flex-col sm:items-end">
                        <InfoDisplay label={``} value={property?.registered_name} />
                        {mode === "invoice" && property?.tax_nbr && (
                            <InfoDisplay label={`${t("Lcz_TaxID")}:`} value={property?.tax_nbr} />
                        )}
                    </div>

                </div>
            </nav>
            <section className="pb-4">
                {<div className="flex items-center w-full justify-between flex-wrap">
                    <p className="property_name">{property?.name}</p>
                    {mode === "invoice" && <div>
                        <InfoDisplay
                            label={`${t("Lcz_InvoiceReference")}:`}
                            value={booking?.financial.invoice_nbr}
                        />
                    </div>}
                </div>}
            </section>
        </header>
    );

}
