import { getI18n } from "@/lib/printing-i18n";
export default function BookingNumberDisplay({ booking }) {
    const { t } = getI18n();
    return (
        <div>
            <p className="text-xl text-gray-900">{t("Lcz_Booking")}#{booking?.booking_nbr}</p>
            {!booking.is_direct && <p className="sm:text-end text-xl">{booking.channel_booking_nbr}</p>}
        </div>
    );
}
