/**
 * Shared header rendered at the top of every city-ledger print document.
 *
 * Start — title + document meta + Bill To (agent)
 * End   — company legal entity + property branding
 *
 * documentType: "invoice" | "receipt" | "creditnote" | "creditreceipt" | "debitnote" | "statement"
 */

/* eslint-disable @next/next/no-img-element */

import InfoDisplay from '@/components/InfoDisplay';
import CompanyInfo from '@/components/printing/CompanyInfo';
import PropertyInfo from '@/components/printing/PropertyInfo';
import { cn } from '@/lib/utils';
import { getI18n } from '@/lib/printing-i18n';
import moment from 'moment';

const DOCUMENT_TITLES = {
  invoice: 'Lcz_Invoice',
  receipt: 'Lcz_Receipt',
  creditnote: 'Lcz_CreditNote',
  creditreceipt: 'Lcz_CreditReceipt',
  debitnote: 'Lcz_DebitNote',
  statement: 'Lcz_AccountStatement',
  proforma: 'Lcz_ProformaInvoice',
};

const DOC_NUMBER_LABELS = {
  invoice: 'Lcz_InvoiceNo',
  receipt: 'Lcz_ReceiptNo',
  creditnote: 'Lcz_CreditNoteNo',
  creditreceipt: 'Lcz_CreditReceiptNo',
  debitnote: 'Lcz_DebitNoteNo',
  statement: null,
  proforma: 'Lcz_Reference',
};

export function DocumentHeader({ isDraft, documentType = 'invoice', property, documentNumber, originalDocNumber, agent, className }) {
  const { t, formatDate } = getI18n();
  const today = formatDate(moment(), 'long');
  const docLabel = DOC_NUMBER_LABELS[documentType] ? t(DOC_NUMBER_LABELS[documentType]) : null;
  const title = DOCUMENT_TITLES[documentType] ? t(DOCUMENT_TITLES[documentType]) : documentType;

  return (
    <header className={cn('text-gray-800 text-base w-full max-w-full', className)}>
      <h3 className="text-3xl font-bold mb-[12pt]">{isDraft ? t('Lcz_X_Draft', title) : title}</h3>
      <nav className="flex flex-row justify-between w-full gap-[16pt]">
        <div className="min-w-0 space-y-[12pt]">
          <div className="w-fit max-w-full space-y-[2pt]">
            {docLabel && documentNumber && (
              <InfoDisplay className="" label={docLabel + ":"} value={documentNumber} />
            )}
            {['creditnote', 'debitnote'].includes(documentType) && originalDocNumber && (
              <i><InfoDisplay className="" label={`${t('Lcz_ForOriginalInvoiceNo')}:`} value={originalDocNumber} /></i>
            )}
            {documentType === 'creditreceipt' && originalDocNumber && (
              <i><InfoDisplay className="" label={`${t('Lcz_ForOriginalReceiptNo')}:`} value={originalDocNumber} /></i>
            )}
            <InfoDisplay className="" label={`${t('Lcz_DateOfIssue')}:`} value={today} />
          </div>
          {agent && (
            <section className="justify-start flex flex-col min-w-0 max-w-full">
              <h3 className="font-bold mb-[3pt]">{t('Lcz_BillTo')}</h3>
              <InfoDisplay label="" value={agent.name} />
              {agent.tax_nbr && <InfoDisplay label="" value={agent.tax_nbr} />}
              {(agent.city || agent.countryName) && (
                <InfoDisplay
                  label=""
                  value={[agent.city, agent.countryName].filter(Boolean).join(', ')}
                />
              )}
            </section>
          )}
        </div>
        <div className="min-w-0 shrink-0 space-y-[7pt]">
          {property?.company && <CompanyInfo company={property.company} hotelName={property.name} />}
          <PropertyInfo property={property} />
        </div>
      </nav>
    </header>
  );
}
