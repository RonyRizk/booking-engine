import { formatAmount } from "@/lib/utils";

export default function TaxAmount({ room, booking, property, locales, currency }) {
    if (!booking?.is_direct) {
        const filtered_data = room.ota_taxes.filter((tx) => tx.amount > 0);
        return filtered_data.map((d, index) => (
            <div key={`room_${d.name}_${index}`} className="flex items-center gap-1 text-xs">
                <p className="label-title">
                    {d.is_exlusive ? locales?.Lcz_Excluding : locales?.Lcz_Including} {d.name}
                </p>
                <p>
                    {d.currency.symbol}
                    {d.amount}
                </p>
            </div>
        ));
    }

    const filtered_data = property?.taxes?.filter((tx) => tx.pct > 0);
    return filtered_data?.map((d, index) => {
        const amount = (room.total * d.pct) / 100;
        return (
            <div key={`direct_room_${d.name}_${index}`} className="flex items-center gap-1 text-xs">
                <p className="label-title">
                    {d.is_exlusive ? locales?.Lcz_Excluding : locales?.Lcz_Including} {d.name}
                </p>
                <p>
                    {d.pct}%: {formatAmount(amount, currency)}
                </p>
            </div>
        );
    });
} 