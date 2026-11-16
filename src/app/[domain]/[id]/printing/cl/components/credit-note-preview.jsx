import { formatAmount } from '@/lib/utils';
import { getI18n } from '@/lib/printing-i18n';
import { fiscalDocumentTypeLabel } from '../utils/fiscal-document-type';
import { DocumentHeader } from './document-header';
import { FiscalDocumentFooter } from '../../shared/fiscal-document-footer';
import { PrintDocument } from '../../shared/print-document';
import {
  PrintTable,
  PrintTableBody,
  PrintTableCell,
  PrintTableHead,
  PrintTableHeaderCell,
  PrintTableRow,
} from '../../shared/print-table';

export function CreditNotePreview({ property, document, documentNumber, agent, documentType = 'creditnote' }) {
  const currency = property?.currency?.symbol ?? document?.CURRENCY_CODE ?? '$';
  const fmt = (v) => (v != null ? `${formatAmount(v * -1, currency)}` : '—');
  const { t, formatDate } = getI18n();
  const fallbackLabel = t(documentType === 'creditreceipt' ? 'Lcz_CreditReceipt' : 'Lcz_CreditNote');

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
              <PrintTableHeaderCell className="border-e">{t('Lcz_Date')}</PrintTableHeaderCell>
              <PrintTableHeaderCell className="border-e">{t('Lcz_Description')}</PrintTableHeaderCell>
              {documentType !== "creditreceipt" && <>
                <PrintTableHeaderCell numeric className="border-e">{t('Lcz_NetPrice')}</PrintTableHeaderCell>
                <PrintTableHeaderCell>{t('Lcz_VAT')}</PrintTableHeaderCell>
                <PrintTableHeaderCell numeric className="border-e">{t('Lcz_Amount')}</PrintTableHeaderCell>
              </>}
              <PrintTableHeaderCell numeric>{t('Lcz_Total')}</PrintTableHeaderCell>
            </PrintTableRow>
          </PrintTableHead>
          <PrintTableBody>
            {document ? (
              <>
                <PrintTableRow>
                  <PrintTableCell muted nowrap className="border-e">
                    {document.ISSUE_DATE ? formatDate(document.ISSUE_DATE) : document.ISSUE_DATE_DISPLAY ?? '—'}
                  </PrintTableCell>
                  <PrintTableCell fill className="border-e">
                    {fiscalDocumentTypeLabel(document, t) ?? fallbackLabel}
                  </PrintTableCell>
                  {documentType !== "creditreceipt" && <>
                    <PrintTableCell numeric bold className="border-e">{fmt(net)}</PrintTableCell>
                    <PrintTableCell numeric muted>
                      {'—'}
                    </PrintTableCell>
                    <PrintTableCell numeric muted className="border-e">{fmt(vatAmt)}</PrintTableCell>
                  </>}
                  <PrintTableCell numeric bold>{fmt(total)}</PrintTableCell>

                </PrintTableRow>

                <PrintTableRow variant="balance">
                  <PrintTableCell />
                  <PrintTableCell />
                  {documentType !== "creditreceipt" && <>
                    <PrintTableCell numeric className="py-4" >
                      <p className="text-sm font-bold text-slate-900">{fmt(net)}</p>
                      <p className="print-caption uppercase tracking-wide text-slate-600 font-medium mt-0.5">{t('Lcz_NetPrice')}</p>
                    </PrintTableCell>
                    <PrintTableCell numeric className="py-4 border-x border-x-slate-200" colSpan={2}>
                      <p className="text-sm font-bold text-slate-900">{fmt(vatAmt)}</p>
                      <p className="print-caption uppercase tracking-wide text-slate-600 font-medium mt-0.5">{t('Lcz_Taxes')}</p>
                    </PrintTableCell>
                  </>}
                  <PrintTableCell numeric className="py-4" >
                    <p className="font-bold text-slate-900">{fmt(total)}</p>
                    <p className="print-caption uppercase tracking-wide text-slate-600 font-medium mt-0.5">{t('Lcz_TotalCredit')}</p>
                  </PrintTableCell>
                </PrintTableRow>
              </>
            ) : (
              <PrintTableRow>
                <PrintTableCell empty colSpan={documentType === "creditreceipt" ? 4 : 6}>
                  {t('Lcz_NoCreditNoteDataFound')}
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
