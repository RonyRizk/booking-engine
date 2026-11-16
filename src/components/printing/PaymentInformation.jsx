import { getI18n } from "@/lib/printing-i18n";
import InfoDisplay from "@/components/InfoDisplay";
import CreditCardInfo from "@/components/printing/CreditCardInfo";
import { formatAmount } from "@/lib/utils";

export default async function PaymentInformation({ printingService, selectedDocumentsItemsKeys, booking, paymentId, mode, setupTables, selectedDocument }) {
    const { t, formatDate } = getI18n();
    const invoicableMode = ["invoice", "creditnote"].includes(mode)
    const payments = (booking.financial?.payments ?? []).filter(p => !p.is_city_ledger);
    function getPaymentDescription(setupTables, paymentTypeCode, paymentMethodCode, designation) {
        const type = setupTables?._PAY_TYPE?.[paymentTypeCode];
        const method = setupTables?._PAY_METHOD?.[paymentMethodCode];

        if (mode === "receipt" && method) {
            return method
        }
        if (type && method) {
            return `${type}: ${method}`;
        }
        if (type) return type;
        if (method) return method;
        if (designation) return designation
        return "_";
    }
    if (mode === "receipt") {
        const payment = payments.find(p => p.system_id?.toString() === paymentId);
        if (!payment) {
            return;
        }
        return <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
            <InfoDisplay
                label={`${t("Lcz_PaymentReceived")}:`}
                value={formatAmount(payment.amount, payment.currency.symbol)}
            />
            <InfoDisplay
                label={`${t("Lcz_Method")}:`}
                value={getPaymentDescription(setupTables, payment.payment_type?.code, payment.payment_method?.code, payment?.designation)}
            />
            <InfoDisplay
                label={`${t("Lcz_Reference")}:`}
                value={payment.reference}
            />
        </section>
    }
    const CancellationPenalty = () => {
        const cancellationPenalty = payments.find(p => p?.payment_type?.code === "013");
        if (!cancellationPenalty) {
            return null
        }
        const canShowCancellationPolicy = invoicableMode && selectedDocument?.items?.find(d => d?.type === "PAYMENT" && d.key === cancellationPenalty?.system_id);
        if (!canShowCancellationPolicy) {
            return null
        }
        return <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
            <div className="flex flex-col sm:justify-between sm:flex-row w-full  sm:items-center  sm:gap-4   flex-wrap">
                <div className="flex flex-col sm:items-center sm:flex-row">
                    <InfoDisplay inline label={""} className={"break-words max-w-[90vw] sm:max-w-2xl sm:mr-4"} value={t("Lcz_CancelationPenalty")}></InfoDisplay>
                    <div className="flex items-center">
                        <span>(</span>
                        <InfoDisplay
                            label={``}
                            value={formatDate(cancellationPenalty?.date, "full")}
                        />
                        <span>)</span>
                    </div>
                </div>
                <span className="font-bold">
                    {formatAmount(
                        cancellationPenalty?.amount || 0,
                        booking?.currency?.symbol
                    )}
                </span>
            </div>
        </section>
    }
    const CreditNotePaymentSummary = () => {
        if (mode !== "creditnote") {
            return null
        }
        return <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
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
    }
    return (
        <>
            <CancellationPenalty />
            {mode !== "creditnote" && <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
                {mode === "printing" && <CreditCardInfo booking={booking} printingService={printingService} />}
                <div className="">
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
                {/* {!booking?.is_direct && booking?.ota_guarante && (
                    <div>
                        <InfoDisplay
                            value={booking?.ota_guarante?.card_type + `${booking?.ota_guarante?.is_virtual ? ' (virtual)' : ''}`}
                            label={`${t("Lcz_CardType")}:`}
                        />
                        <InfoDisplay value={booking?.ota_guarante?.cardholder_name} label={`${t("Lcz_CardHolderName")}:`} />
                        <InfoDisplay value={booking?.ota_guarante?.card_number} label={`${t("Lcz_CardNumber")}:`} />
                        <InfoDisplay
                            value={formatAmount(
                                Number(booking?.ota_guarante?.meta?.virtual_card_current_balance),
                                booking?.ota_guarante?.meta?.virtual_card_currency_code,
                                true
                            )}
                            label={`${t("Lcz_CardBalance")}:`}
                        />
                    </div>
                )} */}
                {payments.length > 0 && !invoicableMode && (
                    <section className="space-y-2.5 py-4">
                        <h1 className="font-medium uppercase">{t(mode === "printing" ? "Lcz_GuestFolio" : "Lcz_PaymentsHistory")}</h1>
                        <div className="overflow-x-auto">
                            <table className="table-auto divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="text-start">
                                    <tr>
                                        <th className="px-2 py-2 font-medium text-gray-900 text-center">
                                            {t("Lcz_Date")}
                                        </th>
                                        <th className="px-2 py-2 font-medium text-gray-900 text-end">
                                            {t("Lcz_Amount")}
                                        </th>
                                        <th className="px-2 py-2 font-medium text-gray-900">
                                            {t("Lcz_Designation")}
                                        </th>
                                        <th className="px-2 py-2 font-medium text-gray-900">
                                            {t("Lcz_Ref")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {payments.map((p) => {
                                        if (!["001", "010"].includes(p.payment_type.code) && mode !== "printing") {
                                            return null
                                        }
                                        return (
                                            <tr key={p.id}>
                                                <td className="px-2 whitespace-nowrap py-1 font-medium text-gray-900 text-center">
                                                    {formatDate(p.date, "dmy")}
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-gray-700 text-end">
                                                    {formatAmount(p.amount, p.currency.symbol)}
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                                                    {getPaymentDescription(setupTables, p.payment_type?.code, p.payment_method?.code, p?.designation)}
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                                                    {p.reference || '_'}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </section>}
            <CreditNotePaymentSummary />
        </>
    );
}
