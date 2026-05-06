import { cn } from "@/lib/utils";
import ExtraService from "./ExtraService";

export default function ExtraServices({ mode, isInvoicableMode, booking, locales, selectedDocumentsItemsKeys }) {
    if (!booking.extra_services) return null;
    const visibleServices = mode === "printing"
        ? booking.extra_services
        : booking.extra_services.filter(service => selectedDocumentsItemsKeys.has(service.system_id));
    if (isInvoicableMode && visibleServices.length === 0) return null;
    const currency = booking?.currency?.symbol;
    return (
        <section className="py-4 border-gray-300 border-y border-b-0">
            <p className="text-lg font-semibold text-gray-900 mb-2.5">
                {locales?.Lcz_ExtraServices}
            </p>
            <ul>
                {visibleServices.map((service, idx) => (
                    <li
                        key={"service_" + service.system_id}
                        className={cn(
                            "flex flex-col sm:justify-between sm:flex-row w-full sm:items-center sm:gap-4 flex-wrap",
                            { "pb-4": idx < visibleServices.length - 1 },
                        )}
                    >
                        <ExtraService service={service} currency={currency} />
                    </li>
                ))}
            </ul>
        </section>
    );
}

