import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";
import { getI18n } from "@/lib/printing-i18n";

function getPaymentDescription(setupTables, payment) {
    const method = setupTables?._PAY_METHOD?.[payment.payment_method?.code];
    if (method) return method;
    const type = setupTables?._PAY_TYPE?.[payment.payment_type?.code];
    if (type) return type;
    return payment.designation ?? "_";
}

export default function ReceiptPaymentSection({ payment, setupTables }) {
    const { t } = getI18n();
    return (
        <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
            <InfoDisplay
                label={`${t("Lcz_PaymentReceived")}:`}
                value={formatAmount(payment.amount, payment.currency.symbol)}
            />
            <InfoDisplay
                label={`${t("Lcz_Method")}:`}
                value={getPaymentDescription(setupTables, payment)}
            />
            <InfoDisplay label={`${t("Lcz_Reference")}:`} value={payment.reference} />
        </section>
    );
}
