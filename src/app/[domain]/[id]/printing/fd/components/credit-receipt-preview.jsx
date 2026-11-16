/**
 * Credit receipt preview for a booking payment.
 *
 * Mirrors the city-ledger credit-note layout in its "creditreceipt" variant:
 * a single-row table with Date · Description · Total and no tax breakdown.
 * Amounts are negated (a credit reverses the original receipt). The data is
 * sourced from the booking payment matched by the `pid` (payment system_id).
 *
 * Also rendered for the "refund" mode: a standalone refund payment printed as
 * a credit receipt, except no receipt number is shown and it is not linked to
 * an original payment (handled by `mode` inside PrintInfo).
 */

import { formatAmount } from '@/lib/utils';
import { getI18n } from '@/lib/printing-i18n';
import { PrintDocument } from '../../shared/print-document';
import { FiscalDocumentFooter } from '../../shared/fiscal-document-footer';
import {
  PrintTable,
  PrintTableBody,
  PrintTableCell,
  PrintTableHead,
  PrintTableHeaderCell,
  PrintTableRow,
} from '../../shared/print-table';
import PrintingHeader from '@/components/printing/PrintingHeader';

function getPaymentDescription(setupTables, payment) {
  const type = setupTables?._PAY_TYPE?.[payment?.payment_type?.code];
  const method = setupTables?._PAY_METHOD?.[payment?.payment_method?.code];
  if (method) return method;
  if (type) return type;
  if (payment?.designation) return payment.designation;
  return getI18n().t('Lcz_CreditReceipt');
}

// ─── CreditReceiptPreview ─────────────────────────────────────────────────────

/**
 * Credit receipt document for a booking payment.
 *
 * @param {object}  props
 * @param {object}  props.booking          - Booking from Get_Exposed_Booking.
 * @param {object}  props.property         - Property from Get_Exposed_Property.
 * @param {string}  [props.documentNumber] - Document number shown in the header.
 * @param {string}  [props.pid]            - Payment system_id to look up the credited payment.
 * @param {object}  [props.setupTables]    - Setup tables for payment method resolution.
 */
export function CreditReceiptPreview({
  booking,
  property,
  documentNumber,
  pid,
  setupTables,
  guestCountryName,
  totalPersons,
  printingService,
  privateNote,
  mode,
}) {
  const { t, formatDate } = getI18n();
  const currencySymbol = property?.currency?.symbol ?? booking?.currency?.symbol ?? '$';

  // Find the credited payment by pid, mirroring the receipt lookup.
  const payment = booking?.financial?.payments?.find(
    (p) => p.system_id?.toString() === pid,
  );

  const sym = payment?.currency?.symbol ?? currencySymbol;
  const fmt = (v) => (v != null ? formatAmount(v, sym) : '—');

  const total = payment?.amount ?? 0;

  return (
    <PrintDocument>
      <PrintingHeader
        className="w-full pb-[20pt]"
        selectedDocument={null}
        documentId={documentNumber}
        receiptNumber={documentNumber}
        pid={pid}
        guestCountryName={guestCountryName}
        totalPersons={totalPersons}
        printingService={printingService}
        privateNote={privateNote}
        booking={booking}
        property={property}
        mode={mode}
      />

      <section>
        <PrintTable>
          <PrintTableHead>
            <PrintTableRow>
              <PrintTableHeaderCell className="border-e">{t('Lcz_Date')}</PrintTableHeaderCell>
              <PrintTableHeaderCell className="border-e">{t('Lcz_Description')}</PrintTableHeaderCell>
              <PrintTableHeaderCell numeric>{t('Lcz_Total')}</PrintTableHeaderCell>
            </PrintTableRow>
          </PrintTableHead>
          <PrintTableBody>
            {payment ? (
              <>
                <PrintTableRow>
                  <PrintTableCell muted nowrap className="border-e">
                    {formatDate(payment.date)}
                  </PrintTableCell>
                  <PrintTableCell fill className="border-e">
                    {t('Lcz_CreditReceipt')}
                  </PrintTableCell>
                  <PrintTableCell numeric bold>{fmt(total)}</PrintTableCell>
                </PrintTableRow>

                <PrintTableRow variant="balance">
                  <PrintTableCell />
                  <PrintTableCell />
                  <PrintTableCell numeric className="py-4">
                    <p className="font-bold text-slate-900">{fmt(total)}</p>
                    <p className="print-caption uppercase tracking-wide text-slate-600 font-medium mt-0.5">
                      {t('Lcz_TotalCredit')}
                    </p>
                  </PrintTableCell>
                </PrintTableRow>
              </>
            ) : (
              <PrintTableRow>
                <PrintTableCell empty colSpan={3}>
                  {t('Lcz_NoPaymentFoundForCreditReceipt')}
                </PrintTableCell>
              </PrintTableRow>
            )}
          </PrintTableBody>
        </PrintTable>
      </section>

      <FiscalDocumentFooter property={property} />
    </PrintDocument>
  );
}
