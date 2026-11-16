/* eslint-disable @next/next/no-img-element */
import { getI18n } from "@/lib/printing-i18n";

export default function BookedOnTimestamp({ booking }) {
    const { formatDate, formatTime } = getI18n();
    return (
        <div className="flex items-center sm:justify-end">
            <p className="booked_on_date">
                {formatDate(booking?.booked_on?.date)}{" "}
                {formatTime(booking?.booked_on?.hour, booking?.booked_on?.minute)}
            </p>
            <img src={booking?.origin.Icon} alt={booking?.origin.Label} className="size-6 aspect-1 ms-2" />
        </div>
    );
}
