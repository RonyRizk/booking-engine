import { bookingData } from "@/emails/previews/data/booking";
import { cancelledBookingData } from "@/emails/previews/data/cancelledBooking";
import { otaData } from "@/emails/previews/data/ota";

const clone = (value) => structuredClone(value);

// `format` holds the gateway's English date strings, which no screen renders. Kept, they would
// hide an English date a screen prints, since the leftover-English check treats data as data.
const withoutFormat = ({ format, ...booking }) => booking;

/** A direct booking with its property, as Get_Exposed_Booking / Get_Exposed_Property return them. */
export const directBooking = () => ({ booking: withoutFormat(clone(bookingData.booking)), property: clone(bookingData.property) });

/** A cancelled direct booking. */
export const cancelledBooking = () => ({ booking: withoutFormat(clone(cancelledBookingData.booking)), property: clone(cancelledBookingData.property) });

/** A booking that came from an OTA channel. */
export const otaBooking = () => ({ booking: withoutFormat(clone(otaData.booking)), property: clone(otaData.property) });
