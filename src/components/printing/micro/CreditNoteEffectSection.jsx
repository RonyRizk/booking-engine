import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";

export default function CreditNoteEffectSection({ selectedDocument, booking }) {
    return (
        <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
            <p className="text-lg font-semibold text-gray-900">Effects on Original Invoice</p>
            <InfoDisplay
                label={`Original invoice total:`}
                value={formatAmount(selectedDocument?.total_amount, booking?.currency?.symbol)}
            />
            <InfoDisplay
                label={`Less: Credit Note:`}
                value={formatAmount(selectedDocument?.total_amount * -1, booking?.currency?.symbol)}
            />
            <InfoDisplay
                label={`Revised net amount:`}
                value={formatAmount(0, booking?.currency?.symbol)}
            />
        </section>
    );
}
