/**
 * Credit note / credit receipt preview for a booking.
 *
 * Identical layout to the invoice but all monetary values are negated. The
 * document header reads "Credit Note" or "Credit Receipt" depending on `mode`,
 * which is forwarded to InvoicePreview → PrintingHeader.
 */

import { InvoicePreview } from './invoice-preview';

// ─── CreditNotePreview ────────────────────────────────────────────────────────

/**
 * Credit note / credit receipt document for a booking — renders InvoicePreview
 * with inverted amounts. The `mode` ("creditnote" | "creditreceipt") prop
 * controls the title and the original-document labels.
 *
 * @param {object}  props
 * @param {object}  props.booking          - Booking from Get_Exposed_Booking.
 * @param {object}  props.property         - Property from Get_Exposed_Property.
 * @param {string}  [props.documentNumber] - Document number shown in the header.
 * @param {string}  [props.mode]           - "creditnote" or "creditreceipt".
 */
export function CreditNotePreview(props) {
  return <InvoicePreview {...props} invertAmounts />;
}
