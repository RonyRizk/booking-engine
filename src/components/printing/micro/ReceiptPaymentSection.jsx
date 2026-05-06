import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";

function getPaymentDescription(setupTables, payment) {
    const method = setupTables?._PAY_METHOD?.[payment.payment_method?.code];
    if (method) return method;
    const type = setupTables?._PAY_TYPE?.[payment.payment_type?.code];
    if (type) return type;
    return payment.designation ?? "_";
}

export default function ReceiptPaymentSection({ payment, setupTables }) {
    return (
        <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
            <InfoDisplay
                label={`Payment received:`}
                value={formatAmount(payment.amount, payment.currency.symbol)}
            />
            <InfoDisplay
                label={`Method:`}
                value={getPaymentDescription(setupTables, payment)}
            />
            <InfoDisplay label={`Reference:`} value={payment.reference} />
        </section>
    );
}
