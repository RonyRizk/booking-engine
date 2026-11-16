import { getI18n } from "@/lib/printing-i18n";
import { cn } from "@/lib/utils"

export default function AccommodationHeader({ mode, booking, totalNights, property, printingService }) {
    const { t, formatDate } = getI18n();
    return (
        <div className={cn("flex items-center justify-between flex-wrap mb-4", { "border-t pt-4 border-gray-300": mode === "creditnote" || mode === "invoice" })}>
            <p className="text-lg font-semibold text-gray-900">{t("Lcz_ACCOMMODATION")}</p>
            <p className="booking-dates">
                {formatDate(booking?.from_date)}
            </p>
            <p className="booking-dates">
                {formatDate(booking?.to_date)}
            </p>
            <p className="number-of-nights">
                {totalNights} {totalNights === 1 ? t("Lcz_night") : t("Lcz_nights")}
            </p>
            <p className="vat-exclusion">
                <i>{property?.tax_statement}</i>
            </p>
        </div>
    );
} 