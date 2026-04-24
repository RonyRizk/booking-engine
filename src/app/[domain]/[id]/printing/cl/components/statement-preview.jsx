import { formatAmount } from '@/lib/utils';
import { format, parse } from 'date-fns';
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

const DATE_DISPLAY = { year: 'numeric', month: 'short', day: '2-digit' };

function formatDocDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return format(parse(dateStr, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy');
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
              Opening Balance — {new Date(fromDate).toLocaleDateString('en-US', DATE_DISPLAY)}
            </PrintTableCell>
            <PrintTableCell />
            <PrintTableCell />
            <PrintTableCell numeric bold>{fmt(STARTING_BALANCE)}</PrintTableCell>
          </PrintTableRow>

          {fiscalDocuments.map((doc, i) => {
            running += (doc.DEBIT ?? 0) - (doc.CREDIT ?? 0);
            return (
              <PrintTableRow key={doc.FD_ID ?? i}>
                <PrintTableCell nowrap>
                  {doc.ISSUE_DATE_DISPLAY || formatDocDate(doc.ISSUE_DATE)}
                </PrintTableCell>
                <PrintTableCell>{doc.DOC_NUMBER || '—'}</PrintTableCell>
                <PrintTableCell>{doc.FD_TYPE_NAME || '—'}</PrintTableCell>
                <PrintTableCell numeric muted>
                  {doc.DEBIT ? fmt(doc.DEBIT) : '—'}
                </PrintTableCell>
                <PrintTableCell numeric muted>
                  {doc.CREDIT ? fmt(doc.CREDIT) : '—'}
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
              Closing Balance — {new Date(toDate).toLocaleDateString('en-US', DATE_DISPLAY)}
            </PrintTableCell>
            <PrintTableCell />
            <PrintTableCell />
            <PrintTableCell numeric bold>{fmt(ENDING_BALANCE)}</PrintTableCell>
          </PrintTableRow>
        </PrintTableBody>
      </PrintTable>
      <FiscalDocumentFooter property={property} />
    </PrintDocument>
  );
}
