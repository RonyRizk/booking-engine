import { formatAmount } from '@/lib/utils';
import { DocumentHeader } from './document-header';
import { PrintDocument } from './print-document';
import { FiscalDocumentFooter } from './fiscal-document-footer';

// ─── Receipt layout sub-components ───────────────────────────────────────────
// Exported so they can be reused in other print documents with a similar layout.

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

// ─── ReceiptPreview ───────────────────────────────────────────────────────────

export function ReceiptPreview({ property, clEntry, document, paymentMethods, documentNumber, agent }) {
  if (!clEntry) return null;

  const currency = property?.currency?.symbol ?? '$';
  const fmt = v => (v != null ? formatAmount(v, currency) : formatAmount(0, currency));
  const getPaymentLabel = code => {
    if (!code) return '—';
    return paymentMethods?.find(e => e.CODE_NAME === code)?.CODE_VALUE_EN ?? code;
  };

  return (
    <PrintDocument>
      <DocumentHeader
        documentType="receipt"
        property={property}
        documentNumber={documentNumber}
        agent={agent}
        className="mb-7"
      />

      <div className="flex flex-col gap-7">
        <ReceiptSection title="Payment Details">
          <ReceiptRow label="Amount Received" value={fmt(clEntry.TOTAL_AMOUNT)} />
          <ReceiptRow label="Payment Method" value={getPaymentLabel(clEntry.PAY_METHOD_CODE)} />
          {clEntry.DESCRIPTION && (
            <ReceiptRow label="Reference" value={clEntry.DESCRIPTION} />
          )}
        </ReceiptSection>

        <ReceiptSection title="Balance Summary (Account)">
          <ReceiptRow label="Balance Before Payment" value={fmt(document?.BALANCE_BEFORE_TX)} />
          <ReceiptRow label="Payment Received" value={fmt(clEntry.TOTAL_AMOUNT)} />
          <ReceiptRow label="Balance After Payment" value={fmt(document?.BALANCE_AFTER_TX)} />
        </ReceiptSection>
      </div>
      <FiscalDocumentFooter property={property} />
    </PrintDocument>
  );
}
