import { getI18n } from "@/lib/printing-i18n";
import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";

/** The pickup's vehicle and how many; `withoutPrice` leaves out its rate and what is due. */
export default function PickupVehicleRow({ pickup_info, withoutPrice = false }) {
    const { t } = getI18n();
    return (
        <div className="flex items-center mt-1.5 sm:mt-0 gap-1.5 sm:gap-4 flex-wrap">
            <p className="car_name">
                {pickup_info.selected_option.vehicle.description}
                {!withoutPrice && (
                    <>
                        <span> - </span>
                        {formatAmount(pickup_info.selected_option.amount, pickup_info.selected_option.currency.symbol)}
                    </>
                )}
            </p>
            <InfoDisplay
                label={`${t("Lcz_NbrOfVehicles")}:`}
                value={pickup_info.nbr_of_units}
            />
            {!withoutPrice && (
                <InfoDisplay
                    label={`${t("Lcz_DueUponBooking")}:`}
                    value={formatAmount(pickup_info.total, pickup_info.currency.symbol)}
                />
            )}
        </div>
    );
}
