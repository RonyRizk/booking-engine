export default function OtaTaxLine({ tax, locales }) {
    return (
        <div className="flex items-center gap-1 text-xs">
            <p className="label-title">
                {tax.is_exlusive ? locales?.Lcz_Excluding : locales?.Lcz_Including} {tax.name}
            </p>
            <p>{tax.currency.symbol}{tax.amount}</p>
        </div>
    );
}
