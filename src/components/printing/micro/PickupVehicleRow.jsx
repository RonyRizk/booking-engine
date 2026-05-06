import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";

export default function PickupVehicleRow({ pickup_info, locales }) {
    return (
        <div className="flex items-center mt-1.5 sm:mt-0 gap-1.5 sm:gap-4 flex-wrap">
            <p className="car_name">
                {pickup_info.selected_option.vehicle.description}
                <span> - </span>
                {formatAmount(pickup_info.selected_option.amount, pickup_info.selected_option.currency.symbol)}
            </p>
            <InfoDisplay
                label={`${locales?.Lcz_NbrOfVehicles}:`}
                value={pickup_info.nbr_of_units}
            />
            <InfoDisplay
                label={`${locales?.Lcz_DueUponBooking}:`}
                value={formatAmount(pickup_info.total, pickup_info.currency.symbol)}
            />
        </div>
    );
}
