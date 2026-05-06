export default function GuestBillingHeader({ mode }) {
    const isInvoicableMode = ["invoice", "creditnote"].includes(mode);
    return <h3 className="font-bold">{isInvoicableMode ? "Bill to" : "From"}</h3>;
}
