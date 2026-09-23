/**
 * Shared header rendered at the top of every city-ledger print document.
 *
 * Left  — title + document meta + Bill To (agent)
 * Right — company legal entity + property branding
 *
 * documentType: "invoice" | "receipt" | "creditnote" | "creditreceipt" | "debitnote" | "statement"
 */

/* eslint-disable @next/next/no-img-element */

import InfoDisplay from '@/components/InfoDisplay';
import CompanyInfo from '@/components/printing/CompanyInfo';
import PropertyInfo from '@/components/printing/PropertyInfo';
import { cn } from '@/lib/utils';
import moment from 'moment';

const DOCUMENT_TITLES = {
  invoice: 'Invoice',
  receipt: 'Receipt',
  creditnote: 'Credit Note',
  creditreceipt: 'Credit Receipt',
  debitnote: 'Debit Note',
  statement: 'Account Statement',
  proforma: 'Proforma Invoice',
};

const DOC_NUMBER_LABELS = {
  invoice: 'Invoice no.',
  receipt: 'Receipt no.',
  creditnote: 'Credit note no.',
  creditreceipt: 'Credit receipt no.',
  debitnote: 'Debit note no.',
  statement: null,
  proforma: 'Reference',
};

export function DocumentHeader({ isDraft, documentType = 'invoice', property, documentNumber, originalDocNumber, agent, className }) {
  const today = moment().locale('en').format('MMMM DD, YYYY');
  const docLabel = DOC_NUMBER_LABELS[documentType];

  return (
    <header className={cn('text-gray-800 text-base w-full max-w-full', className)}>
      <h3 className="text-3xl font-bold mb-[12pt]">{DOCUMENT_TITLES[documentType] ?? documentType} {isDraft ? "draft" : ""}</h3>
      <nav className="flex flex-row justify-between w-full gap-[16pt]">
        <div className="min-w-0 space-y-[12pt]">
          <div className="w-fit max-w-full space-y-[2pt]">
            {docLabel && documentNumber && (
              <InfoDisplay className="" label={docLabel + ":"} value={documentNumber} />
            )}
            {['creditnote', 'debitnote'].includes(documentType) && originalDocNumber && (
              <i><InfoDisplay className="" label="For original invoice no.:" value={originalDocNumber} /></i>
            )}
            {documentType === 'creditreceipt' && originalDocNumber && (
              <i><InfoDisplay className="" label="For original receipt no.:" value={originalDocNumber} /></i>
            )}
            <InfoDisplay className="" label="Date of issue:" value={today} />
          </div>
          {agent && (
            <section className="justify-start flex flex-col min-w-0 max-w-full">
              <h3 className="font-bold mb-[3pt]">Bill to</h3>
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
          {property?.company && <CompanyInfo company={property.company} />}
          <PropertyInfo property={property} />
        </div>
      </nav>
    </header>
  );
}
