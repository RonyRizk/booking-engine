import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";

export default function FinancialSummary({ booking, locales }) {
    return (
        <div>
            <InfoDisplay
                label={`${locales?.Lcz_Balance}:`}
                value={formatAmount(booking?.financial?.due_amount, booking?.currency?.symbol)}
            />
            <InfoDisplay
                label={`${locales?.Lcz_Collected}:`}
                value={formatAmount(
                    (booking?.financial?.collected + booking?.financial?.refunds) ?? 0,
                    booking?.currency?.symbol
                )}
            />
        </div>
    );
}
