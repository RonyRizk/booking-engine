import { getI18n } from "@/lib/printing-i18n";
import InfoDisplay from "@/components/InfoDisplay";
import { occupancyLabels } from "@/components/printing/occupancy-labels";
import { formatAmount } from "@/lib/utils";
import TaxAmount from "./TaxAmount";
import DirectionalArrow from "./micro/DirectionalArrow";

export default function RoomDetails({
  room,
  booking,
  property,
  currency,
  mode,
  printingService,
  idx,
  bed_preferences,
}) {
  const { t, formatDate } = getI18n();
  const getSmokingLabel = () => {
    if (booking.is_direct) {
      if (!room.smoking_option) {
        return null;
      }
      const currRT = property.roomtypes.find(rt => rt.id === room.roomtype.id);
      if (currRT) {
        const smoking_option = currRT['smoking_option']?.allowed_smoking_options;
        if (smoking_option) {
          return smoking_option.find(s => s.code === room.smoking_option)?.description;
        }
        return null;
      }
      return null;
    }
    return room.ota_meta?.smoking_preferences;
  }
  const haveMultipleRooms = property?.roomtypes?.find(rt => rt.id === room?.roomtype?.id)?.physicalrooms?.length > 1 ?? false
  return (
    <section>
      <div className="flex items-center gap-2.5 font-bold text-base mb-1.5">
        <p>{room.roomtype.name}</p>
        {haveMultipleRooms && room.unit && <p>({t("Lcz_UnitNbr", room.unit.name)})</p>}
        <p>{room.rateplan.short_name || room.rateplan.name}</p>
      </div>
      <div className="flex gap-2.5 flex-col sm:flex-row sm:justify-between mb-2.5 sm:gap-10 sm:flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <InfoDisplay
              label={`${t("Lcz_GuestName")}:`}
              value={printingService.formatGuestName(room.sharing_persons?.find(p => p.is_main) ?? room?.guest)}
            />
            <InfoDisplay
              label={``}
              asHtml
              value={printingService.formatGuestAvailability(room?.occupancy, occupancyLabels(t))}
            />
            {mode !== "invoice" && room.bed_preference && (
              <InfoDisplay
                label={``}
                value={`(${printingService.getBedLabel({
                  language: booking.language,
                  bed_preference: room.bed_preference,
                  bed_preferences
                })})`}
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {formatDate(room.from_date)}
              <DirectionalArrow />
              {formatDate(room.to_date)}
            </div>
            {room.departure_time?.description && <p>({t("Lcz_ExpectedDepartureTime_X", room.departure_time?.description)})</p>}
          </div>
          <InfoDisplay label={`${t("Lcz_SmokingOptions")}:`} inline value={getSmokingLabel()}></InfoDisplay>
          {mode !== "invoice" && !booking.is_direct && (
            <>
              <div>
                <InfoDisplay
                  label={`${t("Lcz_MealPlan")}:`}
                  inline
                  value={room?.ota_meta?.meal_plan}
                />
                <div>

                  <InfoDisplay
                    label={`${t("Lcz_Policies")}:`}
                    inline
                    value={room?.ota_meta?.policies}
                  />
                </div>
              </div>
            </>
          )}
          {booking.is_direct && (
            <>
              <div>
                <InfoDisplay
                  label={`${t("Lcz_Cancellation")}:`}
                  inline
                  asHtml
                  value={room.rateplan.cancelation
                    .replace("<u>", "")
                    .replace("</u>", "")
                    .replace("<b>", '<b style="font-weight:bold">')}
                />
              </div>
              <InfoDisplay
                label={`${t("Lcz_Guarantee")}:`}
                asHtml
                inline
                value={room.rateplan.guarantee
                  .replace("<u>", "")
                  .replace("</u>", "")
                  .replace("<b>", '<b style="font-weight:bold">')}
              />
            </>
          )}
        </div>

        <div className="text-end flex flex-col sm:items-end">
          <InfoDisplay
            label={`${t("Lcz_Total")}:`}
            value={formatAmount(room.total, currency)}
          />
          <TaxAmount
            room={room}
            booking={booking}
            property={property}
            currency={currency}
          />
          <div>
            <InfoDisplay
              label={`${t("Lcz_GrandTotal")}:`}
              value={formatAmount(room.gross_total, currency)}
            />
          </div>
          {booking.is_direct && (
            <InfoDisplay
              label={`${t("Lcz_DueUponBooking")}:`}
              value={formatAmount(Number(room.gross_guarantee), currency)}
            />
          )}
        </div>
      </div>
      <div
        className={`flex flex-wrap ${idx < booking?.rooms.length - 1 ? "pb-4 " : ""
          }`}
      >
        {room.days?.map((d) => (
          <div className={"room_amount_container"} key={d.date}>
            <p className="room_amount date">
              {formatDate(d.date, "dayMonth")}
            </p>
            <div className="room_amount amount pr-1.5">
              <p> {formatAmount(d.amount, currency)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
