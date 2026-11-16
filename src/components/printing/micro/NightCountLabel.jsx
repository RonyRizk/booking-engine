import { getI18n } from "@/lib/printing-i18n";
export default function NightCountLabel({ totalNights }) {
    const { t } = getI18n();
    return (
        <p className="number-of-nights">
            {totalNights} {totalNights === 1 ? t("Lcz_night") : t("Lcz_nights")}
        </p>
    );
}
