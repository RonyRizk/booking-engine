import { formatAmount } from "@/lib/utils";

export default function InclusiveTaxLine({ tax, currency, locales }) {
    return (
        <div className="flex items-center gap-1 text-xs">
            <p className="label-title">
                {locales?.Lcz_Including} {tax.TAX_NAME}
            </p>
            <p>{tax.TAX_PCT * 100}%: {formatAmount(tax.CALCULATED_VALUE, currency)}</p>
        </div>
    );
}
