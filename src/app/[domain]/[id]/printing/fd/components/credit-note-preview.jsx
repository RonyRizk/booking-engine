/**
 * Credit note preview for a booking.
 *
 * Identical layout to the invoice but all monetary values are negated and
 * the document header reads "Credit Note".
 */

import { InvoicePreview } from './invoice-preview';

// ─── CreditNotePreview ────────────────────────────────────────────────────────

/**
 * Credit note document for a booking — renders InvoicePreview with inverted amounts.
 *
 * @param {object}  props
 * @param {object}  props.booking          - Booking from Get_Exposed_Booking.
 * @param {object}  props.property         - Property from Get_Exposed_Property.
 * @param {string}  [props.documentNumber] - Document number shown in the header.
 */
export function CreditNotePreview(props) {
  return <InvoicePreview {...props} invertAmounts />;
}
