import { getI18n } from "@/lib/printing-i18n";
export default function OtaTaxLine({ tax }) {
    const { t } = getI18n();
    return (
        <div className="flex items-center gap-1 text-xs">
            <p className="label-title">
                {tax.is_exlusive ? t("Lcz_Excluding") : t("Lcz_Including")} {tax.name}
            </p>
            <p>{tax.currency.symbol}{tax.amount}</p>
        </div>
    );
}
