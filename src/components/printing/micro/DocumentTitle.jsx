import { getI18n } from "@/lib/printing-i18n";

const TITLES = { receipt: "Lcz_Receipt", invoice: "Lcz_Invoice", creditnote: "Lcz_CreditNote" };

export default function DocumentTitle({ mode }) {
    const title = TITLES[mode] ? getI18n().t(TITLES[mode]) : "";
    if (!title) return null;
    return <h3 className="text-3xl font-bold mb-4">{title}</h3>;
}
