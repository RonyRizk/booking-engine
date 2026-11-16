import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";
import moment from "moment";
import { getI18n } from "@/lib/printing-i18n";

export default function CancellationPenaltySection({ cancellationPenalty, booking }) {
    const { t } = getI18n();
    return (
        <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
            <div className="flex flex-col sm:justify-between sm:flex-row w-full sm:items-center sm:gap-4 flex-wrap">
                <div className="flex flex-col sm:items-center sm:flex-row">
                    <InfoDisplay
                        inline
                        label={""}
                        className={"break-words max-w-[90vw] sm:max-w-2xl sm:me-4"}
                        value={t("Lcz_CancelationPenalty")}
                    />
                    <div className="flex items-center">
                        <span>(</span>
                        <InfoDisplay
                            label={``}
                            value={moment(cancellationPenalty.date).locale("en").format("dddd, DD MMM YYYY")}
                        />
                        <span>)</span>
                    </div>
                </div>
                <span className="font-bold">
                    {formatAmount(cancellationPenalty.amount || 0, booking?.currency?.symbol)}
                </span>
            </div>
        </section>
    );
}
