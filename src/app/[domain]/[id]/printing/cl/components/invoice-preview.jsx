import { DocumentHeader } from './document-header';
import { FiscalDocumentFooter } from '../../shared/fiscal-document-footer';
import { FiscalDocumentTable } from './fiscal-document-table';
import { PrintDocument } from '../../shared/print-document';
import { resolveServiceDescriptions } from '../utils/resolve-service-description';

export function InvoicePreview({ property, isDraft, transactions, documentNumber, agent, svcCategory }) {
  // Booking-service rows arrive with their category as a raw setup code in
  // DESCRIPTION ("SVC_CATEGORY" or "SVC_CATEGORY:description") — swap it for
  // the readable label before rendering.
  const rows = resolveServiceDescriptions(transactions, svcCategory);

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
        transactions={rows}
        currencySymbol={property?.currency?.symbol ?? '$'}
        property={property}
      />
      {!isDraft && <FiscalDocumentFooter property={property} />}
    </PrintDocument>
  );
}
