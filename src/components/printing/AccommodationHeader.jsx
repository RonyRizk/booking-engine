export default function AccommodationHeader({ locales, booking, totalNights, property, printingService }) {
    return (
        <div className="flex items-center justify-between flex-wrap mb-4">
            <p className="text-lg font-semibold text-gray-900">{locales?.Lcz_ACCOMMODATION}</p>
            <p className="booking-dates">
                {printingService.formatBookingDates(booking?.from_date)}
            </p>
            <p className="booking-dates">
                {printingService.formatBookingDates(booking?.to_date)}
            </p>
            <p className="number-of-nights">
                {totalNights} {totalNights === 1 ? locales?.Lcz_night : locales?.Lcz_nights}
            </p>
            <p className="vat-exclusion">
                <i>{property?.tax_statement}</i>
            </p>
        </div>
    );
} 