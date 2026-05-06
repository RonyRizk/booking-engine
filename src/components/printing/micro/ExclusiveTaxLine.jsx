import { formatAmount } from "@/lib/utils";

export default function ExclusiveTaxLine({ tax, roomTotal, currency, locales }) {
    const amount = (roomTotal * tax.pct) / 100;
    return (
        <div className="flex items-center gap-1 text-xs">
            <p className="label-title">
                {tax.is_exlusive ? locales?.Lcz_Excluding : locales?.Lcz_Including} {tax.name}
            </p>
            <p>{tax.pct}%: {formatAmount(amount, currency)}</p>
        </div>
    );
}
