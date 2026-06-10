import { formatAmount } from '@/lib/utils';
import { DocumentHeader } from './document-header';
import { PrintDocument, PrintDocumentState } from './print-document';
import {
  PrintTable,
  PrintTableBody,
  PrintTableCell,
  PrintTableHead,
  PrintTableHeaderCell,
  PrintTableRow,
} from './print-table';
import { FiscalDocumentFooter } from './fiscal-document-footer';
import { FdTypes } from '@/lib/enums';
import moment from 'moment';

const DATE_DISPLAY = 'MMM DD, YYYY';

function formatDocDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return moment(dateStr, 'YYYY-MM-DD').locale('en').format(DATE_DISPLAY);
  } catch {
    return dateStr;
  }
}

export function StatementPreview({ property, statement, fiscalDocuments, fromDate, toDate, agent }) {
  if (!statement) return (
    <PrintDocument wide>
      <PrintDocumentState variant="error">No statement data found.</PrintDocumentState>
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
            <PrintTableHeaderCell>Date</PrintTableHeaderCell>
            <PrintTableHeaderCell>Document #</PrintTableHeaderCell>
            <PrintTableHeaderCell>Type</PrintTableHeaderCell>
            <PrintTableHeaderCell numeric>Debit</PrintTableHeaderCell>
            <PrintTableHeaderCell numeric>Credit</PrintTableHeaderCell>
            <PrintTableHeaderCell numeric>Balance</PrintTableHeaderCell>
          </PrintTableRow>
        </PrintTableHead>
        <PrintTableBody>
          <PrintTableRow variant="balance">
            <PrintTableCell colSpan={3}>
              Opening Balance — {moment(fromDate, 'YYYY-MM-DD').locale('en').format(DATE_DISPLAY)}
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
                  {doc.ISSUE_DATE_DISPLAY || formatDocDate(doc.ISSUE_DATE)}
                </PrintTableCell>
                <PrintTableCell>{doc.DOC_NUMBER || '—'}</PrintTableCell>
                <PrintTableCell>{doc.FD_TYPE_NAME || '—'}</PrintTableCell>
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
                No fiscal documents found for this period.
              </PrintTableCell>
            </PrintTableRow>
          )}

          <PrintTableRow variant="balance">
            <PrintTableCell colSpan={3}>
              Closing Balance — {moment(toDate, 'YYYY-MM-DD').locale('en').format(DATE_DISPLAY)}
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
