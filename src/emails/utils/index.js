import moment from 'moment';
import 'moment/locale/ar';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/pl';
import 'moment/locale/uk';
import 'moment/locale/ru';
import 'moment/locale/el';
import { calculateDaysBetweenDates } from '@/lib/utils';

export function formatDate({ date, format, locale }) {
    return moment(date, 'YYYY-MM-DD').locale(locale).format(format)
}


export function formatGuestName(guest) {
    return [guest.first_name, guest.last_name].filter(Boolean).join(" ")
}


export function getBookingDetails({ booking, property }) {
    const currency = booking?.currency?.symbol;
    const totalPersons = booking?.occupancy?.adult_nbr + booking?.occupancy?.children_nbr;
    const totalNights = calculateDaysBetweenDates(booking?.from_date, booking?.to_date);
    const guestCountryName = booking.guest.country.name;
    const privateNote = booking?.extras?.find((k) => k.key === "private_note");
    const bookingEmail = property?.contacts?.find((c) => c.type === "booking")?.email;
    const phone = `+${property?.country?.phone_prefix?.replace("+", "") || ""} - ${property?.phone || ""}`;

    return {
        totalPersons,
        currency,
        totalNights,
        guestCountryName,
        privateNote,
        bookingEmail,
        phone,
        booking,
        property
    };
}
