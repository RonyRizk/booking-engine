export default function BookingDateRange({ booking, printingService }) {
    return (
        <>
            <p className="booking-dates">{printingService.formatBookingDates(booking?.from_date)}</p>
            <p className="booking-dates">{printingService.formatBookingDates(booking?.to_date)}</p>
        </>
    );
}
