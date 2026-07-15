/**
 * Receipt layout sub-components shared by the cl and fd receipt-style
 * documents (labelled rows grouped under a titled section).
 */

export function ReceiptSection({ title, children }) {
  return (
    <section>
      <h4 className="text-slate-800 font-bold text-base border-b border-slate-200 pb-1.5 mb-3">
        {title}
      </h4>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

export function ReceiptRow({ label, value }) {
  return (
    <div className="flex text-sm gap-1">
      <span className="text-slate-600 ">
        {label}:
      </span>
      <span className="text-slate-900 font-medium text-right">{value ?? '—'}</span>
    </div>
  );
}
