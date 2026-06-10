import { formatAmount } from '@/lib/utils';
import { DocumentHeader } from './document-header';
import { FiscalDocumentFooter } from './fiscal-document-footer';
import { PrintDocument } from './print-document';
import {
  PrintTable,
  PrintTableBody,
  PrintTableCell,
  PrintTableHead,
  PrintTableHeaderCell,
  PrintTableRow,
} from './print-table';

export function CreditNotePreview({ property, document, documentNumber, agent, documentType = 'creditnote' }) {
  const currency = property?.currency?.symbol ?? document?.CURRENCY_CODE ?? '$';
  const fmt = (v) => (v != null ? `${formatAmount(v * -1, currency)}` : '—');
  const fallbackLabel = documentType === 'creditreceipt' ? 'Credit Receipt' : 'Credit Note';

  const net = document?.NET_AMOUNT ?? 0;
  const vatAmt = document?.TAX_AMOUNT ?? 0;

  const total = document?.TOTAL_AMOUNT ?? 0;

  return (
    <PrintDocument>
      <DocumentHeader
        documentType={documentType}
        property={property}
        documentNumber={documentNumber}
        originalDocNumber={document?.EXTERNAL_REF}
        agent={agent}
        className="mb-7"
      />

      <section>
        <PrintTable>
          <PrintTableHead>
            <PrintTableRow>
              <PrintTableHeaderCell className="border-r">Date</PrintTableHeaderCell>
              <PrintTableHeaderCell className="border-r w-full">Description</PrintTableHeaderCell>
              {documentType !== "creditreceipt" && <>
                <PrintTableHeaderCell numeric className="border-r">Net Price</PrintTableHeaderCell>
                <PrintTableHeaderCell>VAT</PrintTableHeaderCell>
                <PrintTableHeaderCell numeric className="border-r">Amount</PrintTableHeaderCell>
              </>}
              <PrintTableHeaderCell numeric>Total</PrintTableHeaderCell>
            </PrintTableRow>
          </PrintTableHead>
          <PrintTableBody>
            {document ? (
              <>
                <PrintTableRow>
                  <PrintTableCell muted nowrap className="border-r">
                    {document.ISSUE_DATE_DISPLAY ?? document.ISSUE_DATE ?? '—'}
                  </PrintTableCell>
                  <PrintTableCell className="w-full border-r whitespace-normal break-words text-[0.8rem]">
                    {document.FD_TYPE_NAME ?? fallbackLabel}
                  </PrintTableCell>
                  {documentType !== "creditreceipt" && <>
                    <PrintTableCell numeric bold className="border-r">{fmt(net)}</PrintTableCell>
                    <PrintTableCell numeric muted>
                      {'—'}
                    </PrintTableCell>
                    <PrintTableCell numeric muted className="border-r">{fmt(vatAmt)}</PrintTableCell>
                  </>}
                  <PrintTableCell numeric bold>{fmt(total)}</PrintTableCell>

                </PrintTableRow>

                <PrintTableRow variant="balance">
                  <PrintTableCell />
                  <PrintTableCell />
                  {documentType !== "creditreceipt" && <>
                    <PrintTableCell numeric className="py-4" >
                      <p className="text-[0.8rem] font-bold text-slate-900">{fmt(net)}</p>
                      <p className="text-[0.65rem] uppercase tracking-wide text-slate-600 font-medium mt-0.5">Net Price</p>
                    </PrintTableCell>
                    <PrintTableCell numeric className="py-4 border-x border-x-slate-200" colSpan={2}>
                      <p className="text-[0.8rem] font-bold text-slate-900">{fmt(vatAmt)}</p>
                      <p className="text-[0.65rem] uppercase tracking-wide text-slate-600 font-medium mt-0.5">Taxes</p>
                    </PrintTableCell>
                  </>}
                  <PrintTableCell numeric className="py-4" >
                    <p className="text-[0.85rem] font-bold text-slate-900">{fmt(total)}</p>
                    <p className="text-[0.65rem] uppercase tracking-wide text-slate-600 font-medium mt-0.5">Total Credit</p>
                  </PrintTableCell>
                </PrintTableRow>
              </>
            ) : (
              <PrintTableRow>
                <PrintTableCell empty colSpan={documentType === "creditreceipt" ? 4 : 6}>
                  No credit note data found.
                </PrintTableCell>
              </PrintTableRow>
            )}
          </PrintTableBody>
        </PrintTable>
      </section>

      <FiscalDocumentFooter property={property} />
    </PrintDocument>
  );
}
