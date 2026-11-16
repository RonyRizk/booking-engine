import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";
import { getI18n } from "@/lib/printing-i18n";

export default function CreditNoteEffectSection({ selectedDocument, booking }) {
    const { t } = getI18n();
    return (
        <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
            <p className="text-lg font-semibold text-gray-900">{t("Lcz_EffectsOnOriginalInvoice")}</p>
            <InfoDisplay
                label={`${t("Lcz_OriginalInvoiceTotal")}:`}
                value={formatAmount(selectedDocument?.total_amount, booking?.currency?.symbol)}
            />
            <InfoDisplay
                label={`${t("Lcz_LessCreditNote")}:`}
                value={formatAmount(selectedDocument?.total_amount * -1, booking?.currency?.symbol)}
            />
            <InfoDisplay
                label={`${t("Lcz_RevisedNetAmount")}:`}
                value={formatAmount(0, booking?.currency?.symbol)}
            />
        </section>
    );
}
