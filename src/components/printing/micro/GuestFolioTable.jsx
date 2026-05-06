import PaymentTableRow from "./PaymentTableRow";

export default function GuestFolioTable({ payments, setupTables, locales, mode }) {
    if (payments.length === 0) return null;
    return (
        <section className="space-y-2.5 py-4">
            <h1 className="font-medium uppercase">
                {mode === "printing" ? "Guest Folio" : `${locales?.Lcz_Payments} History`}
            </h1>
            <div className="overflow-x-auto w-full">
                <table className="table-auto w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="border-t-2 ltr:text-left rtl:text-right">
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
                            <th className="px-2 w-full py-2 font-medium text-gray-900">
                                {locales?.Lcz_Ref}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {payments.map(p => {
                            if (!["001", "010"].includes(p.payment_type.code) && mode !== "printing") {
                                return null;
                            }
                            return (
                                <PaymentTableRow
                                    key={p.id}
                                    payment={p}
                                    setupTables={setupTables}
                                    mode={mode}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
