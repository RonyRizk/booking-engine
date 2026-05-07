import InfoDisplay from "@/components/InfoDisplay";
import TaxAmount from "../TaxAmount";
import { formatAmount } from "@/lib/utils";

export default function RoomPriceSummary({ room, booking, property, locales, currency }) {
    return (
        <div className="text-end flex flex-col sm:items-end shrink-0">
            <InfoDisplay
                label={`Subtotal:`}
                value={formatAmount(room.total, currency)}
            />
            <TaxAmount
                room={room}
                booking={booking}
                property={property}
                locales={locales}
                currency={currency}
            />
            <div>
                <InfoDisplay
                    label={`${locales?.Lcz_Total}:`}
                    value={formatAmount(room.gross_total, currency)}
                />
            </div>
        </div>
    );
}
