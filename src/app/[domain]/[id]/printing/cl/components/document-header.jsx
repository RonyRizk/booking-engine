/**
 * Shared header rendered at the top of every city-ledger print document.
 *
 * Left  — title + document meta + Bill To (agent)
 * Right — company legal entity + property branding
 *
 * documentType: "invoice" | "receipt" | "creditnote" | "debitnote" | "statement"
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
  debitnote: 'Debit Note',
  statement: 'Account Statement',
};

const DOC_NUMBER_LABELS = {
  invoice: 'Invoice no.',
  receipt: 'Receipt no.',
  creditnote: 'Credit note no.',
  debitnote: 'Debit note no.',
  statement: null,
};

export function DocumentHeader({ isDraft, documentType = 'invoice', property, documentNumber, originalDocNumber, agent, className }) {
  const today = moment().locale('en').format('MMMM, DD YYYY');
  const docLabel = DOC_NUMBER_LABELS[documentType];

  return (
    <header className={cn('text-gray-800 text-sm w-full capitalize', className)}>
      <h3 className="text-3xl font-bold mb-4">{DOCUMENT_TITLES[documentType] ?? documentType} {isDraft ? "draft" : ""}</h3>
      <nav className="flex gap-4 flex-col-reverse sm:flex-row sm:justify-between sm:w-full">
        <div className="space-y-4">
          <div className="w-fit">
            {docLabel && documentNumber && (
              <InfoDisplay className="grid grid-cols-2" label={docLabel} value={documentNumber} />
            )}
            {['creditnote', 'debitnote'].includes(documentType) && originalDocNumber && (
              <InfoDisplay className="grid grid-cols-2" label="Original invoice no." value={originalDocNumber} />
            )}
            <InfoDisplay className="grid grid-cols-2" label="Date of issue" value={today} />
          </div>
          {agent && (
            <section className="justify-start flex flex-col">
              <h3 className="font-bold">Bill to</h3>
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
        <div className="space-y-2.5">
          {property?.company && <CompanyInfo company={property.company} />}
          <PropertyInfo property={property} />
        </div>
      </nav>
    </header>
  );
}
