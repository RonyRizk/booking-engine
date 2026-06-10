/* eslint-disable @next/next/no-img-element */
import moment from "moment";
import { formatTime } from "@/lib/utils";

export default function BookedOnTimestamp({ booking }) {
    return (
        <div className="flex items-center sm:justify-end">
            <p className="booked_on_date">
                {moment(booking?.booked_on.date, "YYYY-MM-DD").locale("en").format("DD-MMM-YYYY")}{" "}
                {formatTime(booking?.booked_on.hour.toString(), booking?.booked_on.minute.toString())}
            </p>
            <img src={booking?.origin.Icon} alt={booking?.origin.Label} className="size-6 aspect-1 ml-2" />
        </div>
    );
}
