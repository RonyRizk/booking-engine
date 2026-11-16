import { getI18n } from "@/lib/printing-i18n";
import { formatAmount } from "@/lib/utils";

export default function InclusiveTaxLine({ tax, currency }) {
    const { t } = getI18n();
    return (
        <div className="flex items-center gap-1 text-xs">
            <p className="label-title">
                {t("Lcz_Including")} {tax.TAX_NAME}
            </p>
            <p>{tax.TAX_PCT * 100}%: {formatAmount(tax.CALCULATED_VALUE, currency)}</p>
        </div>
    );
}
