import InfoDisplay from "@/components/InfoDisplay";
import TaxAmount from "../TaxAmount";
import { formatAmount } from "@/lib/utils";
import { getI18n } from "@/lib/printing-i18n";

export default function RoomPriceSummary({ room, booking, property, currency }) {
    const { t } = getI18n();
    return (
        <div className="text-end flex flex-col sm:items-end shrink-0">
            <InfoDisplay
                label={`${t("Lcz_Subtotal")}:`}
                value={formatAmount(room.total, currency)}
            />
            <TaxAmount
                room={room}
                booking={booking}
                property={property}
                currency={currency}
            />
            <div>
                <InfoDisplay
                    label={`${t("Lcz_Total")}:`}
                    value={formatAmount(room.gross_total, currency)}
                />
            </div>
        </div>
    );
}
