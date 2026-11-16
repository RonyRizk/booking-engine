import { getI18n } from "@/lib/printing-i18n";
import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";

export default function FinancialSummary({ booking }) {
    const { t } = getI18n();
    return (
        <div>
            <InfoDisplay
                label={`${t("Lcz_Balance")}:`}
                value={formatAmount(booking?.financial?.due_amount, booking?.currency?.symbol)}
            />
            <InfoDisplay
                label={`${t("Lcz_Collected")}:`}
                value={formatAmount(
                    (booking?.financial?.collected + booking?.financial?.refunds) ?? 0,
                    booking?.currency?.symbol
                )}
            />
        </div>
    );
}
