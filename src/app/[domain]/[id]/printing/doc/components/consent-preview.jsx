import { cn } from "@/lib/utils";
import { PrintingModeHeader } from "@/components/printing/micro";
import { getI18n } from "@/lib/printing-i18n";
import { ExtraServiceItem, GuestSection, RoomCard } from "../../fd/components/booking-preview";
import "../../printing.css";
import InfoDisplay from "@/components/InfoDisplay";
import RoomGuestOccupancy from "@/components/printing/micro/RoomGuestOccupancy";

/**
 * Everyone staying in the room, one per line, each with the ID they registered
 * with; `occupancy` sits beside the heading.
 */
function RoomGuests({ guests, occupancy }) {
  const { t, formatDate } = getI18n();

  return (
    <div className="mb-3">
      <div className="flex items-center gap-4 mb-1.5">
        <p className="font-bold text-gray-900">{t("Lcz_Guests")}</p>
        {occupancy}
      </div>
      {/* A field never wraps inside itself: a flex item moves to the next line before
          its text breaks, so a guest with long data continues on a second line right
          under the first. The minimum widths keep short fields lined up between guests. */}
      <ul className="space-y-2.5">
        {guests.map((guest, idx) => (
          <li key={`guest_${guest.id ?? idx}`} className="flex flex-wrap gap-x-4 gap-y-0.5">
            <InfoDisplay className="min-w-[10rem]" label={`${t("Lcz_Name")}:`} value={[guest.first_name, guest.last_name].filter(Boolean).join(" ")} />
            <InfoDisplay className="min-w-[6rem]" value={guest.country?.name} />
            <InfoDisplay className="min-w-[9rem]" label={`${guest.id_info?.type?.description}:`} value={guest.id_info?.type?.description && guest.id_info.number} />
            <InfoDisplay label={`${t("Lcz_DateOfBirth")}:`} value={guest.dob && formatDate(guest.dob)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The registration card of one room: the booking print limited to `room`, with
 * none of the booking's totals, pickup, booking-wide extras or payments, and no
 * arrival time, notes or remarks.
 */
export default function ConsentPreview({ booking, room, property, guestCountryName, printingService, setupTables, bedPreferences }) {
  const { t, dir, formatDate } = getI18n();
  const currency = booking?.currency?.symbol;
  const svcCategory = setupTables._SVC_CATEGORY;
  const roomServices = (booking.extra_services ?? []).filter((service) => service.room_identifier === room.identifier);
  const guests = room.sharing_persons ?? [];
  const terms = property?.extra_info?.find((info) => info.key === "REGISTRATION_CARD_TERMS_AND_CONDITIONS")?.value;

  return (
    <div className="booking-print">
      {/* Sized like the fiscal documents' titles (.fiscal-title, not text-3xl: this
          card's root is larger), on the header's margins; the header's top padding
          gives it the 12pt the fiscal titles have below them. */}
      <h3 className="fiscal-title px-4 pt-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-gray-800" dir={dir}>{t("Lcz_RegistrationCard")}</h3>
      <PrintingModeHeader booking={booking} property={property} mode="printing" />

      <main className="p-4 sm:px-6 lg:px-8 text-gray-800 py-0 text-sm max-w-4xl mx-auto" dir={dir}>
        <GuestSection booking={booking} guestCountryName={guestCountryName} printingService={printingService} contactOnly />

        <section className="pt-4 pb-4">
          <RoomCard
            room={room}
            booking={booking}
            property={property}
            currency={currency}
            bedPreferences={bedPreferences}
            printingService={printingService}
            idx={0}
            totalRooms={1}
            withoutTerms
            guests={guests.length > 0 ? (
              <RoomGuests
                guests={guests}
                occupancy={
                  <RoomGuestOccupancy
                    room={room}
                    booking={booking}
                    mode="printing"
                    bedPreferences={bedPreferences}
                    printingService={printingService}
                    showGuestName={false}
                  />
                }
              />
            ) : null}
          />
          {roomServices.length > 0 && (
            <div className="mt-2 ps-4">
              <p className="text-sm font-bold text-gray-900 whitespace-nowrap mb-2.5">{t("Lcz_Extras")}</p>
              <ul className="space-y-1.5">
                {roomServices.map((service, idx) => (
                  <li
                    key={`service_${service.system_id ?? idx}`}
                    className={cn(
                      "flex flex-col sm:justify-between sm:flex-row w-full sm:items-start sm:gap-4 flex-wrap",
                      { "pb-1": idx < roomServices.length - 1 },
                    )}
                  >
                    <ExtraServiceItem property={property} svcCategory={svcCategory} service={service} currency={currency} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {terms && (
          <section className="py-4 border-t border-gray-600" dangerouslySetInnerHTML={{ __html: terms }} />
        )}

        {/* The day the card is printed, which is the day the guest signs it. */}
        <section className={cn("pb-6 mt-10 justify-center flex items-center gap-16", !terms && "pt-4 border-t border-gray-600")}>
          <InfoDisplay label={`${t("Lcz_Date")}:`} value={formatDate(new Date(), "long")} />
          <div className="flex items-end gap-1">
            <span className="font-semibold text-gray-900">{`${t("Lcz_Signature")}:`}</span>
            <div className="w-40 h-[.75px] bg-gray-600"></div>
          </div>
        </section>
      </main>
    </div>
  );
}
