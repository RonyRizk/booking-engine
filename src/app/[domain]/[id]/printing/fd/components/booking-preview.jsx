import { calculateDaysBetweenDates, cn, formatAmount, isAgentMode } from "@/lib/utils";
import { format, parse } from "date-fns";
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

const MODE = "printing";

// ─── Room ─────────────────────────────────────────────────────────────────────

function RoomCard({ room, booking, property, locales, currency, idx, totalRooms, printingService }) {
  const haveMultipleRooms =
    property?.roomtypes?.find(rt => rt.id === room?.roomtype?.id)?.physicalrooms?.length > 1 ?? false;

  return (
    <section>
      <div className="flex gap-2.5 flex-col sm:flex-row sm:justify-between mb-2.5 sm:gap-10 sm:items-start">
        <div className="flex-1">
          <RoomHeader room={room} locales={locales} haveMultipleRooms={haveMultipleRooms} />
          <RoomGuestOccupancy
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
    </section>
  );
}

// ─── Extra service item ───────────────────────────────────────────────────────

function ExtraServiceItem({ service, currency, svcCategory }) {
  return (
    <>
      <div className="flex flex-col sm:items-center sm:flex-row">
        <InfoDisplay
          inline
          label=""
          className="break-words max-w-[90vw] sm:max-w-2xl sm:mr-4"
          value={`${service.category?.code ? svcCategory[service.category.code] + `${service.description ? ": " : ""}` : ""}${service.description}`}
        />
        <ServiceDateRange service={service} />
      </div>
      <span className="font-bold">{formatAmount(service?.price || 0, currency)}</span>
    </>
  );
}

// ─── Folio ────────────────────────────────────────────────────────────────────
// A self-contained block: accommodation → pickup (optional) → extra services.
// Dividers are only inserted between subsections that actually render.

function Folio({ title, rooms, services, pickupInfo, svcCategory, booking, property, locales, currency, printingService, noBorderTop = false }) {
  const hasRooms = rooms.length > 0;
  const hasPickup = !!pickupInfo;
  const hasServices = services.length > 0;


  return (
    <div className={cn("py-4", !noBorderTop && "border-t border-gray-300")}>
      {title && (
        <p className="text-base font-semibold text-gray-500 uppercase tracking-wide mb-3">{title}</p>
      )}

      {/* Accommodation */}
      {hasRooms && (
        <div>
          {rooms.map((room, idx) => (
            <RoomCard
              key={`room_${room.id}`}
              room={room}
              booking={booking}
              property={property}
              locales={locales}
              currency={currency}
              printingService={printingService}
              idx={idx}
              totalRooms={rooms.length}
            />
          ))}
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
      {hasServices && (
        <>
          {(hasRooms || hasPickup) && <hr className="border-gray-200 my-3" />}
          <p className="text-base font-semibold text-gray-900 mb-2.5">Extras</p>
          <ul>
            {services.map((service, idx) => (
              <li
                key={"service_" + service.system_id}
                className={cn(
                  "flex flex-col sm:justify-between sm:flex-row w-full sm:items-center sm:gap-4 flex-wrap",
                  { "pb-4": idx < services.length - 1 },
                )}
              >
                <ExtraServiceItem svcCategory={svcCategory} service={service} currency={currency} />
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
    return format(parse(dateStr, "yyyy-MM-dd", new Date()), "dd MMM yyyy");
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
    <section className="py-4 border-gray-300 border-y border-b-0">
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
            <tr className="border-t-2 border-gray-300 bg-gray-50">
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
}) {
  const currency = booking?.currency?.symbol;
  const totalNights = calculateDaysBetweenDates(booking.from_date, booking.to_date);
  const formattedGuestName = printingService.formatGuestName(booking?.guest);
  const payments = (booking.financial?.payments ?? []).filter(p => !p.is_city_ledger);
  const guestCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const agentMode = isAgentMode(agent);
  const svcCategory = setupTables._SVC_CATEGORY;

  // Split rooms and services by agent when in agent mode
  const agentRooms = agentMode ? booking.rooms.filter(r => r.agent !== null) : [];
  const guestRooms = agentMode ? booking.rooms.filter(r => r.agent === null) : booking.rooms;
  const agentServices = agentMode ? (booking.extra_services ?? []).filter(s => s.agent !== null) : [];
  const guestServices = agentMode
    ? (booking.extra_services ?? []).filter(s => s.agent === null)
    : (booking.extra_services ?? []);

  return (
    <>
      <PrintingModeHeader booking={booking} property={property} locales={locales} mode={MODE} agent={agent} />

      <main className="p-4 sm:px-6 lg:px-8 text-gray-800 py-0 text-sm max-w-4xl mx-auto" dir="ltr">

        {/* Guest */}
        <section className="py-4 border-y border-gray-300 justify-start flex">
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

        {/* Agent financial summary */}
        {agentMode && (
          <section className="p-4 flex gap-4 border-black border">
            <div className="flex flex-col gap-1.5 flex-1">
              <InfoDisplay
                label="Guest balance:"
                value={formatAmount((booking.guest_financial.gross_total ?? 0) - guestCollected, currency)}
              />
              <InfoDisplay
                label="Guest collected:"
                value={formatAmount(guestCollected, currency)}
              />
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-1">
              <InfoDisplay
                label="Grand total:"
                value={formatAmount(booking.financial?.gross_total ?? 0, currency)}
              />
              <InfoDisplay
                label="Agent total:"
                value={formatAmount(booking.agent_financial.gross_total ?? 0, currency)}
              />
            </div>
          </section>
        )}

        {/* Accommodation header — dates, nights, tax statement */}
        <section className="pt-4">
          <div className="flex items-center justify-between flex-wrap mb-4">
            <p className="text-lg font-semibold text-gray-900">{locales?.Lcz_ACCOMMODATION}</p>
            <BookingDateRange booking={booking} printingService={printingService} />
            <NightCountLabel totalNights={totalNights} locales={locales} />
            <p className="vat-exclusion"><i>{property?.tax_statement}</i></p>
          </div>

          {agentMode ? (
            <>
              {/* Agent folio: rooms → pickup → services */}
              <Folio
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
              <hr className="border-black my-4" />
              {/* Guest folio: rooms → services */}
              <Folio
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
              <div>
                {booking.rooms.map((room, idx) => (
                  <RoomCard
                    key={`room_${room.id}`}
                    room={room}
                    booking={booking}
                    property={property}
                    locales={locales}
                    currency={currency}
                    printingService={printingService}
                    idx={idx}
                    totalRooms={booking.rooms.length}
                  />
                ))}
              </div>

              {booking.pickup_info && (
                <section className="py-4 border-gray-300 border-y border-b-0">
                  <p className="text-lg font-semibold text-gray-900 mb-2.5">
                    {locales?.Lcz_PickupYes?.replace("%1", booking.pickup_info.selected_option.location.description)}
                  </p>
                  <PickupArrivalRow pickup_info={booking.pickup_info} locales={locales} />
                  <PickupVehicleRow pickup_info={booking.pickup_info} locales={locales} />
                </section>
              )}

              {guestServices.length > 0 && (
                <section className="py-4 border-gray-300 border-y border-b-0">
                  <p className="text-lg font-semibold text-gray-900 mb-2.5">{locales?.Lcz_ExtraServices}</p>
                  <ul>
                    {guestServices.map((service, idx) => (
                      <li
                        key={"service_" + service.system_id}
                        className={cn(
                          "flex flex-col sm:justify-between sm:flex-row w-full sm:items-center sm:gap-4 flex-wrap",
                          { "pb-4": idx < guestServices.length - 1 },
                        )}
                      >
                        <ExtraServiceItem svcCategory={svcCategory} service={service} currency={currency} />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </section>

        {/* Payment */}
        <section className="py-4 space-y-2.5 border-gray-300 border-y border-b-0">
          <CreditCardInfo booking={booking} printingService={printingService} />
          <GuestFolioTable payments={payments} setupTables={setupTables} locales={locales} mode={MODE} />
        </section>

      </main>
    </>
  );
}
