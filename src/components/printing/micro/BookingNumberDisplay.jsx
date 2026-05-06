export default function BookingNumberDisplay({ booking, locales }) {
    return (
        <div>
            <p className="text-xl text-gray-900">{locales?.Lcz_Booking}#{booking?.booking_nbr}</p>
            {!booking.is_direct && <p className="sm:text-end text-xl">{booking.channel_booking_nbr}</p>}
        </div>
    );
}
