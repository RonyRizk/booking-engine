import { DocumentHeader } from './document-header';
import { FiscalDocumentFooter } from '../../shared/fiscal-document-footer';
import { FiscalDocumentTable } from './fiscal-document-table';
import { PrintDocument } from '../../shared/print-document';

export function InvoicePreview({ property, isDraft, transactions, documentNumber, agent }) {
  return (
    <PrintDocument>
      <DocumentHeader
        isDraft={isDraft}
        documentType="invoice"
        property={property}
        documentNumber={documentNumber}
        agent={agent}
        className="mb-7"
      />
      <FiscalDocumentTable
        transactions={transactions}
        currencySymbol={property?.currency?.symbol ?? '$'}
        property={property}
      />
      {!isDraft && <FiscalDocumentFooter property={property} />}
    </PrintDocument>
  );
}
