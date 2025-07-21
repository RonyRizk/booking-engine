import InfoDisplay from "@/components/InfoDisplay";
import { formatAmount } from "@/lib/utils";
import TaxAmount from "./TaxAmount";

export default function RoomDetails({
  room,
  booking,
  property,
  locales,
  currency,
  mode,
  printingService,
  idx,
}) {
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
        {haveMultipleRooms && room.unit && <p>({locales.Lcz_UnitNbr?.replace('%1', room.unit.name) ?? `unit ${room.roomtype.id}`})</p>}
        <p>{room.rateplan.short_name || room.rateplan.name}</p>
      </div>
      <div className="flex gap-2.5 flex-col md:flex-row md:justify-between mb-2.5 md:gap-10 md:flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <InfoDisplay
              label={`${locales?.Lcz_GuestName}:`}
              value={printingService.formatGuestName(room?.guest)}
            />
            <InfoDisplay
              label={``}
              asHtml
              value={printingService.formatGuestAvailability(
                room?.rateplan.selected_variation,
                room.occupancy,
                locales
              )}
            />
            {mode !== "invoice" && room.bed_preference && (
              <InfoDisplay
                label={``}
                value={`(${printingService.getBedLabel({
                  language: booking.language,
                  bed_preference: room.bed_preference,
                })})`}
              />
            )}
          </div>
          <InfoDisplay label={`${locales?.Lcz_SmokingOptions}:`} inline value={getSmokingLabel()}></InfoDisplay>
          {mode !== "invoice" && !booking.is_direct && (
            <>
              <div>
                <InfoDisplay
                  label={`${locales?.Lcz_MealPlan}:`}
                  inline
                  value={room?.ota_meta?.meal_plan}
                />
                <div>

                  <InfoDisplay
                    label={`${locales?.Lcz_Policies}:`}
                    inline
                    value={room?.ota_meta?.policies}
                  />
                </div>
              </div>
            </>
          )}
          {booking.is_direct && (
            <>
              <p
                className=""
                dangerouslySetInnerHTML={{
                  __html: room.rateplan.cancelation
                    .replace("<u>", "")
                    .replace("</u>", "")
                    .replace("<b>", '<b style="font-weight:bold">'),
                }}
              ></p>
              <p
                className=""
                dangerouslySetInnerHTML={{
                  __html: room.rateplan.guarantee
                    .replace("<u>", "")
                    .replace("</u>", "")
                    .replace("<b>", '<b style="font-weight:bold">'),
                }}
              ></p>
            </>
          )}
        </div>
        <div className="text-end flex flex-col md:items-end">
          <InfoDisplay
            label={`${locales?.Lcz_Total}:`}
            value={formatAmount(room.total, currency)}
          />
          <TaxAmount
            room={room}
            booking={booking}
            property={property}
            locales={locales}
            currency={currency}
          />
          <div>
            <InfoDisplay
              label={`${locales?.Lcz_GrandTotal}:`}
              value={formatAmount(room.gross_total, currency)}
            />
          </div>
          {booking.is_direct && (
            <InfoDisplay
              label={`${locales?.Lcz_DueUponBooking}:`}
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
              {printingService.formatDate(d.date, "YYYY-MM-DD")}
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
