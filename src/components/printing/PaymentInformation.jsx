import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";
import { format } from "date-fns";

export default function PaymentInformation({ selectedDocumentsItemsKeys, booking, locales, paymentId, mode, setupTables, selectedDocument }) {
    const invoicableMode = ["invoice", "creditnote"].includes(mode)
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
        const payment = booking.financial?.payments?.find(p => p.system_id?.toString() === paymentId);
        if (!payment) {
            return;
        }
        return <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
            <InfoDisplay
                label={`Payment received:`}
                value={formatAmount(payment.amount, payment.currency.symbol)}
            />
            <InfoDisplay
                label={`Method:`}
                value={getPaymentDescription(setupTables, payment.payment_type?.code, payment.payment_method?.code, payment?.designation)}
            />
            <InfoDisplay
                label={`Reference:`}
                value={payment.reference}
            />
        </section>
    }
    const CancellationPenalty = () => {
        const cancellationPenalty = booking.financial?.payments?.find(p => p?.payment_type?.code === "013");
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
                    <InfoDisplay inline label={""} className={"break-words max-w-[90vw] sm:max-w-2xl sm:mr-4"} value={"Cancellation penalty"}></InfoDisplay>
                    <div className="flex items-center">
                        <span>(</span>
                        <InfoDisplay
                            label={``}
                            value={format(
                                new Date(cancellationPenalty?.date),
                                "eeee, dd MMM yyyy"
                            )}
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
    }
    const CreditCardInfo = () => {
        if (booking.is_direct) {
            if (!booking.guest.cci) {
                return;
            }
            return (<div className="border-b pb-2.5">
                <p class="text-lg font-semibold mb-4 text-gray-900">Card Details</p>
                <InfoDisplay label={"Name: "} value={booking.guest.cci.holder_name}></InfoDisplay>
                <InfoDisplay label={"Number: "} value={booking.guest.cci.nbr}></InfoDisplay>
                <InfoDisplay label={"Expiry: "} value={`${booking.guest.cci.expiry_month}/${booking.guest.cci.expiry_year}`}></InfoDisplay>
            </div>)
        }
        if (!booking.ota_guarante) {
            return null
        }
        const { ota_guarante } = booking
        return (<div className="border-b pb-2.5">
            <p class="text-lg font-semibold mb-4 text-gray-900">Card Details</p>
            <InfoDisplay value={ota_guarante.card_type + `${ota_guarante.is_virtual ? ' (virtual)' : ''}`} label={`Type:`} />
            <InfoDisplay value={ota_guarante.cardholder_name} label={`Name:`} />
            <InfoDisplay value={ota_guarante.card_number} label={`Number:`} />
        </div>)
    }
    return (
        <>
            <CancellationPenalty />
            {mode !== "creditnote" && <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
                {mode === "printing" && <CreditCardInfo />}
                <div className="">
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
                {!booking?.is_direct && booking?.ota_guarante && (
                    <div>
                        <InfoDisplay
                            value={booking?.ota_guarante?.card_type + `${booking?.ota_guarante?.is_virtual ? ' (virtual)' : ''}`}
                            label={`${locales?.Lcz_CardType}:`}
                        />
                        <InfoDisplay value={booking?.ota_guarante?.cardholder_name} label={`${locales?.Lcz_CardHolderName}:`} />
                        <InfoDisplay value={booking?.ota_guarante?.card_number} label={`${locales?.Lcz_CardNumber}:`} />
                        <InfoDisplay
                            value={formatAmount(
                                Number(booking?.ota_guarante?.meta?.virtual_card_current_balance),
                                booking?.ota_guarante?.meta?.virtual_card_currency_code,
                                true
                            )}
                            label={`${locales?.Lcz_CardBalance}:`}
                        />
                    </div>
                )}
                {booking.financial?.payments && !invoicableMode && (
                    <section className="space-y-2.5 py-4">
                        <h1 className="font-medium uppercase">{mode === "printing" ? "Guest Folio" : `${locales?.Lcz_Payments} History`} </h1>
                        <div className="overflow-x-auto">
                            <table className="table-auto divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="ltr:text-left rtl:text-right">
                                    <tr>
                                        <th className="px-2 py-2 font-medium text-gray-900 text-center">
                                            {locales?.Lcz_Date}
                                        </th>
                                        <th className="px-2 py-2 font-medium text-gray-900 text-end">
                                            {locales?.Lcz_Amount}
                                        </th>
                                        <th className="px-2 py-2 font-medium text-gray-900">
                                            {locales?.Lcz_Designation}
                                        </th>
                                        <th className="px-2 py-2 font-medium text-gray-900">
                                            {locales?.Lcz_Ref}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {booking.financial?.payments?.map((p) => {
                                        if (!["001", "010"].includes(p.payment_type.code) && mode !== "printing") {
                                            return null
                                        }
                                        return (
                                            <tr key={p.id}>
                                                <td className="px-2 whitespace-nowrap py-1 font-medium text-gray-900 text-center">
                                                    {format(new Date(p.date), 'dd-MMM-yyyy')}
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
