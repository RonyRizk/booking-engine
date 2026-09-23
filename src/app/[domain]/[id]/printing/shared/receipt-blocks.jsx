/**
 * Receipt layout sub-components shared by the cl and fd receipt-style
 * documents (labelled rows grouped under a titled section).
 */

export function ReceiptSection({ title, children }) {
  return (
    <section className="max-w-full break-inside-avoid">
      <h4 className="text-slate-800 font-bold text-base border-b border-slate-200 pb-[4pt] mb-[8pt]">
        {title}
      </h4>
      <div className="flex flex-col gap-[5pt]">{children}</div>
    </section>
  );
}

export function ReceiptRow({ label, value }) {
  return (
    <div className="flex text-base gap-[3pt] max-w-full">
      <span className="text-slate-600 whitespace-nowrap">
        {label}:
      </span>
      <span className="text-slate-900 font-medium min-w-0 break-words">{value ?? '—'}</span>
    </div>
  );
}
