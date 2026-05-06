export default function BookingStatusBadge({ booking }) {
    return (
        <p className="text-gray-900 text-lg font-semibold">{booking.status.description}</p>
    );
}
