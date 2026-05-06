import { DocumentHeader } from './document-header';
import { FiscalDocumentFooter } from './fiscal-document-footer';
import { FiscalDocumentTable } from './fiscal-document-table';
import { PrintDocument } from './print-document';

export function ProformaPreview({ property, transactions, documentNumber, agent }) {
  return (
    <PrintDocument>
      <DocumentHeader
        documentType="proforma"
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
      <FiscalDocumentFooter property={property} />
    </PrintDocument>
  );
}
