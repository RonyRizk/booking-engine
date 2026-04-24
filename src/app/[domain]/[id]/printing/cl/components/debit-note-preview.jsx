import { DocumentHeader } from './document-header';
import { FiscalDocumentFooter } from './fiscal-document-footer';
import { FiscalDocumentTable } from './fiscal-document-table';
import { PrintDocument } from './print-document';

export function DebitNotePreview({ property, document, transactions, documentNumber, agent }) {
  return (
    <PrintDocument>
      <DocumentHeader
        documentType="debitnote"
        property={property}
        documentNumber={documentNumber}
        originalDocNumber={document?.EXTERNAL_REF}
        agent={agent}
        className="mb-7"
      />
      <FiscalDocumentTable
        transactions={transactions}
        currencySymbol={property?.currency?.symbol ?? '$'}
        property={property}
      />
      <FiscalDocumentFooter property={property} />
    </PrintDocument>
  );
}
