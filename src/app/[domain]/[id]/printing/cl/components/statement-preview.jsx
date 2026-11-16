import { fiscalDocumentTypeLabel } from '../utils/fiscal-document-type';
import { formatAmount } from '@/lib/utils';
import { DocumentHeader } from './document-header';
import { PrintDocument, PrintDocumentState } from '../../shared/print-document';
import {
  PrintTable,
  PrintTableBody,
  PrintTableCell,
  PrintTableHead,
  PrintTableHeaderCell,
  PrintTableRow,
} from '../../shared/print-table';
import { FiscalDocumentFooter } from '../../shared/fiscal-document-footer';
import { FdTypes } from '@/lib/enums';
import { getI18n } from '@/lib/printing-i18n';

export function StatementPreview({ property, statement, fiscalDocuments, fromDate, toDate, agent }) {
  const { t, formatDate } = getI18n();
  if (!statement) return (
    <PrintDocument wide>
      <PrintDocumentState variant="error">{t('Lcz_NoStatementDataFound')}</PrintDocumentState>
    </PrintDocument>
  );

  const { STARTING_BALANCE, ENDING_BALANCE } = statement;
  const currency = property?.currency?.symbol ?? '$';
  const fmt = v => (v != null ? formatAmount(v, currency) : '—');

  let running = STARTING_BALANCE;

  const runningBalances = (() => {
    let balance = STARTING_BALANCE;
    const debitFdTypeCode = new Set([FdTypes.Invoice, FdTypes.DebitNote, FdTypes.Draft, FdTypes.CreditReceipt])
    return fiscalDocuments.map(doc => {
      if (debitFdTypeCode.has(doc.FD_TYPE_CODE)) {
        balance += doc.DEBIT ?? 0;
      } else {
        balance -= Math.abs(doc.CREDIT ?? 0);
      }
      return balance;
    })
  })()

  const getCredit = (doc) => {
    const { FD_TYPE_CODE, DEBIT, CREDIT } = doc;
    const value = CREDIT;

    switch (FD_TYPE_CODE) {
      case FdTypes.CreditReceipt:
        return -DEBIT;

      case FdTypes.Receipt:
        return Math.abs(value);

      default:
        return value;
    }
  }
  const getDebit = (doc) => {
    const { FD_TYPE_CODE, DEBIT, } = doc;
    const value = DEBIT;

    switch (FD_TYPE_CODE) {
      case FdTypes.CreditReceipt:
        return null;
      default:
        return value;
    }
  }

  return (
    <PrintDocument wide>
      <DocumentHeader
        documentType="statement"
        property={property}
        agent={agent}
        className="mb-7"
      />

      <PrintTable>
        <PrintTableHead>
          <PrintTableRow>
            <PrintTableHeaderCell>{t('Lcz_Date')}</PrintTableHeaderCell>
            <PrintTableHeaderCell>{t('Lcz_DocumentNbr')}</PrintTableHeaderCell>
            <PrintTableHeaderCell>{t('Lcz_Type')}</PrintTableHeaderCell>
            <PrintTableHeaderCell numeric>{t('Lcz_Debit')}</PrintTableHeaderCell>
            <PrintTableHeaderCell numeric>{t('Lcz_Credit')}</PrintTableHeaderCell>
            <PrintTableHeaderCell numeric>{t('Lcz_Balance')}</PrintTableHeaderCell>
          </PrintTableRow>
        </PrintTableHead>
        <PrintTableBody>
          <PrintTableRow variant="balance">
            <PrintTableCell colSpan={3}>
              {t('Lcz_OpeningBalanceOn_X', formatDate(fromDate))}
            </PrintTableCell>
            <PrintTableCell />
            <PrintTableCell />
            <PrintTableCell numeric bold>{fmt(STARTING_BALANCE)}</PrintTableCell>
          </PrintTableRow>

          {fiscalDocuments.map((doc, i) => {
            running = runningBalances[i];
            const credit = getCredit(doc)
            const debit = getDebit(doc)
            return (
              <PrintTableRow key={doc.FD_ID ?? i}>
                <PrintTableCell nowrap>
                  {doc.ISSUE_DATE ? formatDate(doc.ISSUE_DATE) : doc.ISSUE_DATE_DISPLAY || '—'}
                </PrintTableCell>
                <PrintTableCell>{doc.DOC_NUMBER || '—'}</PrintTableCell>
                <PrintTableCell fill>{fiscalDocumentTypeLabel(doc, t) || '—'}</PrintTableCell>
                <PrintTableCell numeric muted>
                  {debit ? fmt(debit) : '—'}
                </PrintTableCell>
                <PrintTableCell numeric muted>
                  {credit ? fmt(credit) : '—'}
                </PrintTableCell>
                <PrintTableCell numeric bold>{fmt(running)}</PrintTableCell>
              </PrintTableRow>
            );
          })}

          {fiscalDocuments.length === 0 && (
            <PrintTableRow>
              <PrintTableCell empty colSpan={6}>
                {t('Lcz_NoFiscalDocumentsFoundForPeriod')}
              </PrintTableCell>
            </PrintTableRow>
          )}

          <PrintTableRow variant="balance">
            <PrintTableCell colSpan={3}>
              {t('Lcz_ClosingBalanceOn_X', formatDate(toDate))}
            </PrintTableCell>
            <PrintTableCell />
            <PrintTableCell />
            <PrintTableCell numeric bold>{fmt(runningBalances[runningBalances.length - 1])}</PrintTableCell>
          </PrintTableRow>
        </PrintTableBody>
      </PrintTable>
      <FiscalDocumentFooter property={property} />
    </PrintDocument>
  );
}
