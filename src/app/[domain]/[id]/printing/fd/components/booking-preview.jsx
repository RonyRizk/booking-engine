import { calculateDaysBetweenDates, cn, formatAmount, formatTime, isAgentMode } from "@/lib/utils";
import moment from "moment";
import InfoDisplay from "@/components/InfoDisplay";
import CreditCardInfo from "@/components/printing/CreditCardInfo";
import {
  PrintingModeHeader,
  BilledToName,
  GuestContactDetails,
  ArrivalTimeDisplay,
  BookingRemarks,
  BookingStatusBadge,
  BookingDateRange,
  NightCountLabel,
  RoomHeader,
  RoomGuestOccupancy,
  RoomDateRange,
  SmokingPreference,
  OtaRoomMeta,
  DirectBookingPolicies,
  RoomPriceSummary,
  DailyRateGrid,
  PickupArrivalRow,
  PickupVehicleRow,
  ServiceDateRange,
  FinancialSummary,
  GuestFolioTable,
} from "@/components/printing/micro";
import "../../printing.css";
import { splitServicesByRoom } from "../utils/split-services-by-room";

const MODE = "printing";

// ─── Room ─────────────────────────────────────────────────────────────────────

function RoomCard({ room, booking, property, bedPreferences, locales, currency, idx, totalRooms, printingService }) {
  const haveMultipleRooms =
    property?.roomtypes?.find(rt => rt.id === room?.roomtype?.id)?.physicalrooms?.length > 1 ?? false;

  return (
    <section>
      <RoomHeader room={room} locales={locales} haveMultipleRooms={haveMultipleRooms} />
      <div className="pl-4">
        <div className="flex gap-2.5 flex-col sm:flex-row sm:justify-between mb-2.5 sm:gap-10 sm:items-start">
          <div className="flex-1">
            <RoomGuestOccupancy
              bedPreferences={bedPreferences}
              room={room}
              booking={booking}
              locales={locales}
              mode={MODE}
              printingService={printingService}
            />
            <RoomDateRange room={room} printingService={printingService} mode={MODE} />
            <SmokingPreference room={room} booking={booking} property={property} locales={locales} />
            {!booking.is_direct && <OtaRoomMeta room={room} locales={locales} />}
            {booking.is_direct && <DirectBookingPolicies room={room} />}
            {booking.is_direct && (
              <InfoDisplay
                label={`Guarantee amount:`}
                value={formatAmount(Number(room.gross_guarantee), currency)}
              />
            )}
          </div>
          <RoomPriceSummary
            room={room}
            booking={booking}
            property={property}
            locales={locales}
            currency={currency}
          />
        </div>
        <DailyRateGrid
          room={room}
          currency={currency}
          printingService={printingService}
          idx={idx}
          totalRooms={totalRooms}
        />
      </div>
    </section>
  );
}

// ─── Extra service item ───────────────────────────────────────────────────────

function ExtraServiceItem({ service, currency, svcCategory, property }) {
  const vatPercent = service?.charges?.vat_percent;
  const formatDayUseTime = (time) => {
    if (!time) {
      return ""
    }
    const [hour, minute] = time.split(':');
    return formatTime(hour, minute);
  }
  const linkedUnitName = () => {
    if (service?.pr_id == null) {
      return null;
    }
    for (const roomtype of property?.roomtypes ?? []) {
      const physicalRoom = (roomtype.physicalrooms ?? []).find((pr) => pr.id === service.pr_id);
      if (physicalRoom) {
        return physicalRoom.name;
      }
    }
    return null;
  }
  const unit = linkedUnitName()
  return (
    <>
      <div className="flex flex-col">
        <InfoDisplay
          inline
          label=""
          className="break-words max-w-[90vw] sm:max-w-2xl"
          value={`${service.category?.code ? svcCategory[service.category.code] + `${service.description ? ": " : ""}` : ""}${service.description ?? ""}${service.category.code === "DUZ" ? `: ${formatDayUseTime(service.from_time)} – ${formatDayUseTime(service.to_time)}` : ""}${unit ? ` (Unit: ${unit})` : ""}`}
        />
        <ServiceDateRange service={service} />
      </div>
      <div className="flex flex-col sm:items-end">
        <span className="font-bold">{formatAmount(service?.price || 0, currency)}</span>
        {vatPercent != null && (
          <span className="text-xs text-gray-500">VAT: {vatPercent}%</span>
        )}
      </div>
    </>
  );
}

// ─── Folio ────────────────────────────────────────────────────────────────────
// A self-contained block: accommodation → pickup (optional) → extra services.
// Dividers are only inserted between subsections that actually render.

function Folio({ title, rooms, bedPreferences, services, pickupInfo, svcCategory, booking, property, locales, currency, printingService, noBorderTop = false }) {
  const hasRooms = rooms.length > 0;
  const hasPickup = !!pickupInfo;
  const hasServices = services.length > 0;

  // Room-scoped services render under their room; the rest ("general") keep
  // rendering in the trailing "Extras" block below.
  const { byRoom: servicesByRoom, general: generalServices } = splitServicesByRoom(services, rooms);
  const hasGeneralServices = generalServices.length > 0;

  if (!hasRooms && !hasPickup && !hasServices) return null;

  return (
    <div className={cn("py-4", !noBorderTop && "border-t border-gray-600")}>
      {title && (
        <p className="text-base font-semibold text-gray-500 uppercase tracking-wide mb-3">{title}</p>
      )}

      {/* Accommodation */}
      {hasRooms && (
        <div>
          {rooms.map((room, idx) => {
            const roomServices = servicesByRoom.get(room.identifier) ?? [];
            return (
              <div
                key={`room_${room?.id ?? ""}_${idx}`}
                className={cn(
                  idx > 0 && "mt-4",
                  idx < rooms.length - 1 && "pb-4 border-b border-gray-200",
                )}
              >
                <RoomCard
                  bedPreferences={bedPreferences}
                  room={room}
                  booking={booking}
                  property={property}
                  locales={locales}
                  currency={currency}
                  printingService={printingService}
                  idx={idx}
                  totalRooms={rooms.length}
                />
                {roomServices.length > 0 && (
                  <div className="mt-2 pl-4">
                    <p className="font-bold text-gray-900 whitespace-nowrap mb-2.5">Extras</p>
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
              </div>
            );
          })}
        </div>
      )}

      {/* Pickup */}
      {hasPickup && (
        <>
          {hasRooms && <hr className="border-gray-200 my-3" />}
          <p className="text-base font-semibold text-gray-900 mb-2.5">
            {locales?.Lcz_PickupYes?.replace("%1", pickupInfo.selected_option.location.description)}
          </p>
          <PickupArrivalRow pickup_info={pickupInfo} locales={locales} />
          <PickupVehicleRow pickup_info={pickupInfo} locales={locales} />
        </>
      )}

      {/* Extra services */}
      {hasGeneralServices && (
        <>
          {(hasRooms || hasPickup) && <hr className="border-gray-200 my-3" />}
          <p className="font-bold text-sm text-gray-900 whitespace-nowrap mb-2.5">Extras</p>
          <ul className="space-y-1.5">
            {generalServices.map((service, idx) => (
              <li
                key={`service_${service.system_id ?? idx}`}
                className={cn(
                  "flex flex-col sm:justify-between sm:flex-row w-full sm:items-start sm:gap-4 flex-wrap",
                  { "pb-4": idx < generalServices.length - 1 },
                )}
              >
                <ExtraServiceItem property={property} svcCategory={svcCategory} service={service} currency={currency} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ─── City Ledger ──────────────────────────────────────────────────────────────

const CREDIT_TYPES = new Set(["PAY", "CN", "DSC"]);

const TX_TYPE_LABELS = {
  PAY: "Payment",
  OB: "Opening Balance",
  ADJ: "Adjustment",
  CN: "Credit Note",
  DN: "Debit Note",
  DB: "Charge",
  DSC: "Discount",
  CPN: "Cancellation Penalty",
};

function formatCLDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return moment(dateStr, "YYYY-MM-DD").locale("en").format("MMM DD, YYYY");
  } catch {
    return dateStr;
  }
}

function CityLedgerTable({ transactions, currency }) {
  if (!transactions?.length) return null;

  // const total = transactions.reduce((sum, tx) => {
  //   const isCredit = CREDIT_TYPES.has(tx.CL_TX_TYPE_CODE);
  //   return sum + (isCredit ? -(tx.TOTAL_AMOUNT ?? 0) : (tx.TOTAL_AMOUNT ?? 0));
  // }, 0);

  return (
    <section className="py-4 border-gray-600 border-y border-b-0">
      <p className="font-medium uppercase mb-2.5">Agent Folio</p>
      <div className="overflow-x-auto w-full">
        <table className="table-auto w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="border-t-2 ltr:text-left rtl:text-right">
            <tr>
              <th className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap">Status</th>
              <th className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap">Served Date</th>
              <th className="px-2 py-2 font-medium text-gray-900 w-full">Description</th>
              <th className="px-2 py-2 font-medium text-gray-900 text-end whitespace-nowrap">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((tx, idx) => {
              const isCredit = CREDIT_TYPES.has(tx.CL_TX_TYPE_CODE);
              const amount = isCredit ? -(tx.TOTAL_AMOUNT ?? 0) : (tx.TOTAL_AMOUNT ?? 0);
              return (
                <tr key={tx.CL_TX_ID ?? idx}>
                  <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                    {TX_TYPE_LABELS[tx.CL_TX_TYPE_CODE] ?? tx.CL_TX_TYPE_CODE ?? "—"}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                    {formatCLDate(tx.SERVICE_DATE)}
                  </td>
                  <td className="px-2 py-1 text-gray-700 break-words">
                    {tx.DESCRIPTION || "—"}
                  </td>
                  <td className={cn("px-2 py-1 whitespace-nowrap text-end font-medium",)}>
                    {formatAmount(amount, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* <tfoot>
            <tr className="border-t-2 border-gray-600 bg-gray-50">
              <td colSpan={3} className="px-2 py-2 font-semibold text-gray-900">Total</td>
              <td className={cn("px-2 py-2 text-end font-bold", total < 0 ? "text-red-600" : "text-gray-900")}>
                {formatAmount(total, currency)}
              </td>
            </tr>
          </tfoot> */}
        </table>
      </div>
    </section>
  );
}

// ─── Financial ────────────────────────────────────────────────────────────────
// Mirrors the stencil <ir-payment-summary> component: agent-mode splits guest
// vs. agent totals (folding in city-ledger adjustments); guest-mode shows the
// booking balance/collected plus an optional cost line and the grand total.


function FinancialSection({ booking, agentMode, currency, locales, isAllServicesAgentOwned }) {
  const agentTotal = booking.financial.agent_total;
  const bookingTotal = booking.financial.booking_total;

  if (agentMode) {
    return (
      <section className="py-4 px-2 border-t-0 border-gray-600 border ">
        <div className="flex gap-4 flex-wrap justify-between">
          {!isAllServicesAgentOwned && (
            <div className="flex flex-col gap-1.5">
              <InfoDisplay label="Guest Balance:" value={formatAmount(booking?.guest_financial?.due_amount, currency)} />
              <InfoDisplay label="Guest Collected:" value={formatAmount((booking?.financial?.collected ?? 0) + (booking?.financial?.refunds ?? 0), currency)} />
            </div>
          )}
          <div className="flex flex-col items-end gap-1.5">
            <InfoDisplay label="Booking Total:" value={formatAmount(bookingTotal ?? 0, currency)} />
            <InfoDisplay label="Agent Total:" value={formatAmount(agentTotal, currency)} />
          </div>
        </div>
      </section>
    );
  }

  const totalCost = booking?.financial?.gross_cost;
  const shouldShowTotalCost = totalCost > 0 && totalCost !== null;

  return (
    <section className="py-4 px-2 border-t-0 border-gray-600 border ">
      {/* <p className="text-lg font-semibold text-gray-900 mb-2.5">Financial</p> */}
      <div className="flex gap-4 flex-wrap justify-between">
        <div className="flex flex-col gap-1.5">
          <InfoDisplay label={`${locales?.Lcz_Balance}:`} value={formatAmount(booking?.financial?.due_amount, currency)} />
          <InfoDisplay
            label={`${locales?.Lcz_Collected}:`}
            value={formatAmount((booking?.financial?.collected ?? 0) + (booking?.financial?.refunds ?? 0), currency)}
          />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {shouldShowTotalCost && <InfoDisplay label="Total Cost:" value={formatAmount(totalCost, currency)} />}
          <InfoDisplay label="Grand Total:" value={formatAmount(bookingTotal ?? 0, currency)} />
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookingPreview({
  booking,
  property,
  locales,
  guestCountryName,
  agent,
  printingService,
  privateNote,
  setupTables,
  clTransactions = [],
  bedPreferences,
}) {
  const currency = booking?.currency?.symbol;
  const totalNights = calculateDaysBetweenDates(booking.from_date, booking.to_date);
  const formattedGuestName = printingService.formatGuestName(booking?.guest);
  const payments = (booking.financial?.payments ?? []).filter(p => !p.is_city_ledger);
  const agentMode = isAgentMode(agent);
  const svcCategory = setupTables._SVC_CATEGORY;

  // Split rooms and services by agent when in agent mode
  const agentRooms = agentMode ? (booking.rooms ?? []).filter(r => r.agent !== null) : [];
  const guestRooms = agentMode ? (booking.rooms ?? []).filter(r => r.agent === null) : (booking.rooms ?? []);
  const agentServices = agentMode ? (booking.extra_services ?? []).filter(s => s.agent !== null) : [];
  const guestServices = agentMode
    ? (booking.extra_services ?? []).filter(s => s.agent === null)
    : (booking.extra_services ?? []);

  // Non-agent flat layout only: room-scoped services render under their room,
  // the rest ("general") keep rendering in the trailing "Extras" section.
  const { byRoom: guestServicesByRoom, general: generalGuestServices } = splitServicesByRoom(
    guestServices,
    booking.rooms,
  );

  const hasAgentFolioData = agentRooms.length > 0 || agentServices.length > 0 || !!booking.pickup_info;
  const hasGuestFolioData = guestRooms.length > 0 || guestServices.length > 0;
  const hasAnythingBeforeGuestFolio = hasAgentFolioData || clTransactions.length > 0;

  return (
    <>
      <PrintingModeHeader booking={booking} property={property} locales={locales} mode={MODE} agent={agent} />

      <main className="p-4 sm:px-6 lg:px-8 text-gray-800 py-0 text-sm max-w-4xl mx-auto" dir="ltr">

        {/* Guest */}
        <section className="py-4 border-y border-gray-600 justify-start flex">
          <div className="flex-1">
            <BilledToName
              formattedGuestName={formattedGuestName}
              isInvoicableMode={false}
              selectedDocument={null}
              companyName={booking?.company_name}
            />
            <GuestContactDetails
              booking={booking}
              guestCountryName={guestCountryName}
              printingService={printingService}
            />
            <ArrivalTimeDisplay booking={booking} locales={locales} />
            <BookingRemarks booking={booking} locales={locales} privateNote={privateNote} />
          </div>
          <BookingStatusBadge booking={booking} />
        </section>

        {/* Financial */}
        <FinancialSection
          booking={booking}
          agentMode={agentMode}
          currency={currency}
          clTransactions={clTransactions}
          locales={locales}
          isAllServicesAgentOwned={!hasGuestFolioData}
        />

        {/* Accommodation header — dates, nights, tax statement */}
        <section className="pt-4">
          {booking.rooms.length > 0 && <div className="flex items-center justify-between flex-wrap mb-4">
            <p className="text-lg font-semibold text-gray-900">{locales?.Lcz_ACCOMMODATION}</p>
            <BookingDateRange booking={booking} printingService={printingService} />
            <NightCountLabel totalNights={totalNights} locales={locales} />
            <p className="vat-exclusion"><i>{property?.tax_statement}</i></p>
          </div>}

          {agentMode ? (
            <>
              {/* Agent folio: rooms → pickup → services */}
              <Folio
                bedPreferences={bedPreferences}
                svcCategory={svcCategory}
                title={`${booking.agent.name} Services`}
                rooms={agentRooms}
                services={agentServices}
                pickupInfo={booking.pickup_info ?? null}
                booking={booking}
                property={property}
                locales={locales}
                currency={currency}
                printingService={printingService}
              />
              {/* City Ledger — agent mode only */}
              <CityLedgerTable transactions={clTransactions} currency={currency} />
              {hasGuestFolioData && hasAnythingBeforeGuestFolio && <hr className="border-black my-4" />}
              {/* Guest folio: rooms → services */}
              <Folio
                bedPreferences={bedPreferences}
                svcCategory={svcCategory}
                noBorderTop
                title="Guest Services"
                rooms={guestRooms}
                services={guestServices}
                pickupInfo={null}
                booking={booking}
                property={property}
                locales={locales}
                currency={currency}
                printingService={printingService}
              />
            </>
          ) : (
            <>
              {/* Non-agent: flat layout */}
              <div className="pb-4">
                {booking.rooms.map((room, idx) => {
                  const roomServices = guestServicesByRoom.get(room.identifier) ?? [];
                  return (
                    <div
                      key={`room_${room?.id ?? ""}_${idx}`}
                      className={cn(
                        idx > 0 && "mt-4",
                        idx < booking.rooms.length - 1 && "pb-4 border-b border-gray-300",
                      )}
                    >
                      <RoomCard
                        room={room}
                        booking={booking}
                        property={property}
                        locales={locales}
                        currency={currency}
                        bedPreferences={bedPreferences}
                        printingService={printingService}
                        idx={idx}
                        totalRooms={booking.rooms.length}
                      />
                      {roomServices.length > 0 && (
                        <div className="mt-2 pl-4">
                          <p className="text-sm font-bold text-gray-900 whitespace-nowrap  mb-2.5">Extras</p>
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
                    </div>
                  );
                })}
              </div>

              {booking.pickup_info && (
                <section className="py-4 empty:border-0 border-gray-600 border-y border-b-0">
                  <p className="text-lg font-semibold text-gray-900 mb-2.5">
                    {locales?.Lcz_PickupYes?.replace("%1", booking.pickup_info.selected_option.location.description)}
                  </p>
                  <PickupArrivalRow pickup_info={booking.pickup_info} locales={locales} />
                  <PickupVehicleRow pickup_info={booking.pickup_info} locales={locales} />
                </section>
              )}

              {generalGuestServices.length > 0 && (
                <section className={cn("py-4 empty:border-0 border-gray-600 border-y border-b-0", {
                  "border-0 pt-0": booking.rooms.length === 0
                })}>
                  <p className="text-lg font-semibold text-gray-900 mb-2.5">Additional Services</p>
                  <ul className="">
                    {generalGuestServices.map((service, idx) => (
                      <li
                        key={`service_${service.system_id ?? idx}`}
                        className={cn(
                          "flex flex-col sm:justify-between sm:flex-row w-full sm:items-start sm:gap-4 flex-wrap",
                          { "pb-4": idx < generalGuestServices.length - 1 },
                        )}
                      >
                        <ExtraServiceItem property={property} svcCategory={svcCategory} service={service} currency={currency} />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </section>

        {/* Payment */}
        <section className="py-4 space-y-2.5 empty:border-0 border-gray-600 border-y border-b-0">
          <CreditCardInfo booking={booking} printingService={printingService} />
          <GuestFolioTable payments={payments} setupTables={setupTables} locales={locales} mode={MODE} />
        </section>

      </main>
    </>
  );
}
