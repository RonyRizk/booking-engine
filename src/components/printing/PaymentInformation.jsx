import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";
import { format } from "date-fns";

export default function PaymentInformation({ booking, locales, mode }) {
    return (
        <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
            <div className="">
                <InfoDisplay
                    label={`${locales?.Lcz_Balance}:`}
                    value={formatAmount(booking?.financial?.due_amount, booking?.currency?.symbol)}
                />
                <InfoDisplay
                    label={`${locales?.Lcz_Collected}:`}
                    value={formatAmount(
                        booking?.financial?.payments ? booking?.financial?.payments.reduce((prev, curr) => prev + curr.amount, 0) : 0,
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
            {booking.financial?.payments && (
                <section className="space-y-2.5 py-4">
                    <h1 className="font-medium uppercase">{locales?.Lcz_Payments} History </h1>
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
                                {booking.financial?.payments?.map((p) => (
                                    <tr key={p.id}>
                                        <td className="px-2 whitespace-nowrap py-1 font-medium text-gray-900 text-center">
                                            {format(new Date(p.date), 'dd-MMM-yyyy')}
                                        </td>
                                        <td className="px-2 py-1 whitespace-nowrap text-gray-700 text-end">
                                            {formatAmount(p.amount, p.currency.symbol)}
                                        </td>
                                        <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                                            {p.designation || '_'}
                                        </td>
                                        <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                                            {p.reference || '_'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </section>
    );
} 