import { getI18n } from "@/lib/printing-i18n";

export default function GuestBillingHeader({ mode }) {
    const isInvoicableMode = ["invoice", "creditnote"].includes(mode);
    return <h3 className="font-bold">{getI18n().t(isInvoicableMode ? "Lcz_BillTo" : "Lcz_From")}</h3>;
}
