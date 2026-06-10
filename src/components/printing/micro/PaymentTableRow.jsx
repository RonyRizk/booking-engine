import moment from "moment";
import { formatAmount } from "@/lib/utils";

function getPaymentDescription(setupTables, payment, mode) {
    const type = setupTables?._PAY_TYPE?.[payment.payment_type?.code];
    const method = setupTables?._PAY_METHOD?.[payment.payment_method?.code];
    if (mode === "receipt" && method) return method;
    if (type && method) return `${type}: ${method}`;
    if (type) return type;
    if (method) return method;
    if (payment.designation) return payment.designation;
    return "_";
}

export default function PaymentTableRow({ payment: p, setupTables, mode }) {
    return (
        <tr>
            <td className="px-2 whitespace-nowrap py-1 font-medium text-gray-900 text-center">
                {moment(p.date).locale('en').format('DD-MMM-YYYY')}
            </td>
            <td className="px-2 py-1 whitespace-nowrap text-gray-700 text-end">
                {formatAmount(p.amount, p.currency.symbol)}
            </td>
            <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                {getPaymentDescription(setupTables, p, mode)}
            </td>
            <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                {p.reference || '_'}
            </td>
        </tr>
    );
}
