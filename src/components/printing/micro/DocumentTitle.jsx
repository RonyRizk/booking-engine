export default function DocumentTitle({ mode }) {
    const titles = { receipt: "Receipt", invoice: "Invoice", creditnote: "Credit Note" };
    const title = titles[mode] ?? "";
    if (!title) return null;
    return <h3 className="text-3xl font-bold mb-4">{title}</h3>;
}
