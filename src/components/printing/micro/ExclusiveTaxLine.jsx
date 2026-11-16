import { getI18n } from "@/lib/printing-i18n";
import { formatAmount } from "@/lib/utils";

export default function ExclusiveTaxLine({ tax, roomTotal, currency }) {
    const { t } = getI18n();
    const amount = (roomTotal * tax.pct) / 100;
    return (
        <div className="flex items-center gap-1 text-xs">
            <p className="label-title">
                {tax.is_exlusive ? t("Lcz_Excluding") : t("Lcz_Including")} {tax.name}
            </p>
            <p>{tax.pct}%: {formatAmount(amount, currency)}</p>
        </div>
    );
}
