import PaymentTableRow from "./PaymentTableRow";
import { getI18n } from "@/lib/printing-i18n";

export default function GuestFolioTable({ payments, setupTables, mode }) {
    if (payments.length === 0) return null;
    const { t } = getI18n();
    return (
        <section className="space-y-2.5 py-4">
            <h1 className="font-medium uppercase">
                {t(mode === "printing" ? "Lcz_GuestFolio" : "Lcz_PaymentsHistory")}
            </h1>
            <div className="overflow-x-auto w-full">
                <table className="table-auto w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="border-t-2 text-start">
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
                            <th className="px-2 w-full py-2 font-medium text-gray-900">
                                {t("Lcz_Ref")}
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
                                    key={p.system_id}
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
