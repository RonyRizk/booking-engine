import InfoDisplay from "@/components/InfoDisplay";
import { format } from "date-fns";
import { cn, formatAmount } from "@/lib/utils";

export default function ExtraServices({ mode, isInvoicableMode, booking, locales, selectedDocumentsItemsKeys }) {
    if (!booking.extra_services) return null;
    const invoiceableServices = mode === "printing" ? booking.extra_services : booking.extra_services.filter(service => selectedDocumentsItemsKeys.has(service.system_id));
    if (isInvoicableMode && invoiceableServices.length === 0) {
        return null;
    }
    return (
        <section className="py-4 border-gray-300 border-y border-b-0">
            <p className="text-lg font-semibold text-gray-900 mb-2.5">
                {locales?.Lcz_ExtraServices}
            </p>
            <ul >
                {invoiceableServices?.map((service, idx) => (
                    <li key={"service_" + service.system_id} className={cn("flex flex-col sm:justify-between sm:flex-row w-full  sm:items-center  sm:gap-4   flex-wrap", { "pb-4": idx < booking.extra_services.length - 1 })}>
                        {/* <span>Dates</span> */}
                        <div className="flex flex-col sm:items-center sm:flex-row">

                            <InfoDisplay inline label={""} className={"break-words max-w-[90vw] sm:max-w-2xl sm:mr-4"} value={service.description}></InfoDisplay>
                            <div className="flex items-center">
                                {(service.start_date || service.end_date) && <span>(</span>}
                                {service.start_date && <InfoDisplay
                                    className={"w-fit"}
                                    label={``}
                                    value={format(
                                        new Date(service?.start_date),
                                        "eeee, dd MMM yyyy"
                                    )}
                                />}

                                {service.end_date && <span className="px-1"> - </span>}
                                {service.end_date && <InfoDisplay
                                    label={``}
                                    value={format(
                                        new Date(service?.end_date),
                                        "eeee, dd MMM yyyy"
                                    )}
                                />}
                                {(service.start_date || service.end_date) && <span>)</span>}
                            </div>
                        </div>
                        <span className="font-bold">
                            {formatAmount(
                                service?.price || 0,
                                booking?.currency?.symbol
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
} 
