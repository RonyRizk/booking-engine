import { getI18n } from "@/lib/printing-i18n";
import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";

export default function PickupInformation({ booking, mode, selectedDocument }) {
    const { t, formatDate, formatTime } = getI18n();
    if (!booking.pickup_info) return null;

    return (
        <section className="py-4 border-gray-300 border-y border-b-0">
            <p className="text-lg font-semibold text-gray-900 mb-2.5">
                {t("Lcz_PickupYes", booking.pickup_info.selected_option.location.description)}
            </p>
            <div>
                <div className="flex items-center gap-1.5 sm:gap-4 flex-wrap ">
                    <InfoDisplay
                        label={`${t("Lcz_ArrivalDate")}:`}
                        value={formatDate(booking?.pickup_info.date, "full")}
                    />
                    <InfoDisplay
                        label={`${t("Lcz_ArrivalTime")}:`}
                        value={formatTime(booking.pickup_info.hour, booking.pickup_info.minute)}
                    />
                    <InfoDisplay
                        label={`${t("Lcz_FlightDetails")}:`}
                        value={booking?.pickup_info.details}
                    />
                </div>
                <div className="flex items-center mt-1.5 sm:mt-0 gap-1.5 sm:gap-4 flex-wrap">
                    <p className="car_name">
                        {booking.pickup_info.selected_option.vehicle.description}
                        <span> - </span>
                        {formatAmount(
                            booking.pickup_info.selected_option.amount,
                            booking.pickup_info.selected_option.currency.symbol
                        )}
                    </p>
                    <InfoDisplay
                        label={`${t("Lcz_NbrOfVehicles")}:`}
                        value={booking?.pickup_info.nbr_of_units}
                    />
                    <InfoDisplay
                        label={`${t("Lcz_DueUponBooking")}:`}
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
