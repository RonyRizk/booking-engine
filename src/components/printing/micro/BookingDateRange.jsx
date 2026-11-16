import { getI18n } from "@/lib/printing-i18n";

export default function BookingDateRange({ booking }) {
    const { formatDate } = getI18n();
    return (
        <>
            <p className="booking-dates">{formatDate(booking?.from_date)}</p>
            <p className="booking-dates">{formatDate(booking?.to_date)}</p>
        </>
    );
}
