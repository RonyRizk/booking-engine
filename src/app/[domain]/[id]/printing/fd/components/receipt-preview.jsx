/**
 * Receipt preview for a booking payment.
 *
 * Shows the amount received, payment method, and an account balance summary
 * (balance before payment → payment → balance after payment).
 */

import { formatAmount } from '@/lib/utils';
import { PrintDocument } from '../../cl/components/print-document';
import { ReceiptRow, ReceiptSection } from '../../cl/components/receipt-preview';
import { FiscalDocumentFooter } from '../../cl/components/fiscal-document-footer';
import PrintingHeader from '@/components/printing/PrintingHeader';

// ─── ReceiptPreview ───────────────────────────────────────────────────────────

/**
 * Receipt document for a booking payment.
 *
 * @param {object}  props
 * @param {object}  props.booking          - Booking from Get_Exposed_Booking.
 * @param {object}  props.property         - Property from Get_Exposed_Property.
 * @param {string}  [props.documentNumber] - Document number shown in the header.
 * @param {string}  [props.pid]            - Payment system_id to look up the specific payment.
 * @param {object}  [props.setupTables]    - Setup tables for payment method resolution.
 */
export function ReceiptPreview({ booking, property, documentNumber, pid, setupTables, mode, locales, guestCountryName, totalPersons, printingService, privateNote, rnb }) {
  const currencySymbol = property?.currency?.symbol ?? booking?.currency?.symbol ?? '$';
  const fmt = (v, sym) => (v != null ? formatAmount(v, sym ?? currencySymbol) : '—');
  const guestName = [booking?.guest?.first_name, booking?.guest?.last_name].filter(Boolean).join(' ');

  const financials = booking?.financial;

  // Find the specific payment by pid, mirroring PaymentInformation receipt logic
  const payment = financials?.payments?.find(p => p.system_id?.toString() === pid);

  function getPaymentMethod(paymentTypeCode, paymentMethodCode, designation) {
    const method = setupTables?._PAY_METHOD?.[paymentMethodCode];
    if (method) return method;
    const type = setupTables?._PAY_TYPE?.[paymentTypeCode];
    if (type && method) return `${type}: ${method}`;
    if (type) return type;
    if (designation) return designation;
    return '—';
  }

  return (
    <PrintDocument>
      <PrintingHeader
        className="p-0 sm:px-0 pb-8 w-full lg:px-0 max-w-full print:m-0 print:px-0"
        selectedDocument={null}
        documentId={documentNumber}
        receiptNumber={rnb}
        pid={pid}
        guestCountryName={guestCountryName}
        totalPersons={totalPersons}
        printingService={printingService}
        privateNote={privateNote}
        booking={booking}
        property={property}
        locales={locales}
        mode={mode}
      />

      <div className="flex flex-col gap-7">
        {/* <ReceiptSection title="Booking Details">
          {booking?.booking_nbr && (
            <ReceiptRow label="Booking #" value={booking.booking_nbr} />
          )}
          {booking?.from_date && (
            <ReceiptRow
              label="Stay"
              value={`${booking.from_date} – ${booking.to_date}`}
            />
          )}
        </ReceiptSection> */}

        {payment && (
          <ReceiptSection title="">
            <ReceiptRow
              label="Amount Received"
              value={fmt(payment.amount, payment.currency?.symbol)}
            />
            <ReceiptRow
              label="Method"
              value={getPaymentMethod(payment.payment_type?.code, payment.payment_method?.code, payment?.designation)}
            />
            {payment.reference && (
              <ReceiptRow label="Reference" value={payment.reference} />
            )}
          </ReceiptSection>
        )}

        {/* <ReceiptSection title="Balance Summary">
          <ReceiptRow label="Total Charged" value={fmt(financials?.total_amount)} />
          <ReceiptRow label="Total Paid" value={fmt(financials?.paid_amount)} />
          <ReceiptRow label="Outstanding Balance" value={fmt(financials?.due_amount)} />
        </ReceiptSection> */}
      </div>
      <FiscalDocumentFooter property={property} />
    </PrintDocument>
  );
}
