import InfoDisplay from "@/components/InfoDisplay";
import { format } from "date-fns";
import { formatAmount, formatTime } from "@/lib/utils";

export default function PickupInformation({ booking, locales }) {
    if (!booking.pickup_info) return null;

    return (
        <section className="py-4 border-gray-300 border-y border-b-0">
            <p className="text-lg font-semibold text-gray-900 mb-2.5">
                {locales?.Lcz_PickupYes.replace("%1", booking.pickup_info.selected_option.location.description)}
            </p>
            <div>
                <div className="flex items-center gap-1.5 md:gap-4 flex-wrap ">
                    <InfoDisplay
                        label={`${locales?.Lcz_ArrivalDate}:`}
                        value={format(
                            new Date(booking?.pickup_info.date),
                            "eeee, dd MMM yyyy"
                        )}
                    />
                    <InfoDisplay
                        label={`${locales?.Lcz_ArrivalTime}:`}
                        value={formatTime(
                            booking.pickup_info.hour.toString(),
                            booking.pickup_info.minute.toString()
                        )}
                    />
                    <InfoDisplay
                        label={`${locales?.Lcz_FlightDetails}:`}
                        value={booking?.pickup_info.details}
                    />
                </div>
                <div className="flex items-center mt-1.5 md:mt-0 gap-1.5 md:gap-4 flex-wrap">
                    <p className="car_name">
                        {booking.pickup_info.selected_option.vehicle.description}
                        <span> - </span>
                        {formatAmount(
                            booking.pickup_info.selected_option.amount,
                            booking.pickup_info.selected_option.currency.symbol
                        )}
                    </p>
                    <InfoDisplay
                        label={`${locales?.Lcz_NbrOfVehicles}:`}
                        value={booking?.pickup_info.nbr_of_units}
                    />
                    <InfoDisplay
                        label={`${locales?.Lcz_DueUponBooking}:`}
                        value={formatAmount(
                            booking?.pickup_info.total,
                            booking.pickup_info.currency.symbol
                        )}
                    />
                </div>
            </div>
        </section>
    );
} 