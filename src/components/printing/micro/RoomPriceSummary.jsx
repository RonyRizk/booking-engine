import InfoDisplay from "@/components/InfoDisplay";
import TaxAmount from "../TaxAmount";
import { formatAmount } from "@/lib/utils";

export default function RoomPriceSummary({ room, booking, property, locales, currency }) {
    return (
        <div className="text-end flex flex-col sm:items-end">
            <InfoDisplay
                label={`${locales?.Lcz_Total}:`}
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
                    label={`${locales?.Lcz_GrandTotal}:`}
                    value={formatAmount(room.gross_total, currency)}
                />
            </div>
            {booking.is_direct && (
                <InfoDisplay
                    label={`${locales?.Lcz_DueUponBooking}:`}
                    value={formatAmount(Number(room.gross_guarantee), currency)}
                />
            )}
        </div>
    );
}
