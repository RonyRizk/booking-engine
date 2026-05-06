import InfoDisplay from "@/components/InfoDisplay";

export default function BookingNumberLine({ booking }) {
    const getBookingNumbers = () => {
        const parts = [];
        if (!booking.is_direct) parts.push(booking.channel_booking_nbr);
        parts.push(booking.booking_nbr);
        return parts.join(' | ');
    };
    return (
        <InfoDisplay className={""} label={"Booking number"} value={"#" + getBookingNumbers()} />
    );
}
