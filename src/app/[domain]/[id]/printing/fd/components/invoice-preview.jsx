import { formatAmount } from "@/lib/utils";
import { format, parse } from "date-fns";
import { FiscalDocumentFooter } from "../../cl/components/fiscal-document-footer";
import { PrintDocument } from "../../cl/components/print-document";
import { ReceiptRow, ReceiptSection } from "../../cl/components/receipt-preview";
import {
  PrintTable,
  PrintTableBody,
  PrintTableCell,
  PrintTableHead,
  PrintTableHeaderCell,
  PrintTableRow,
} from "../../cl/components/print-table";
import PrintingHeader from "@/components/printing/PrintingHeader";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return format(parse(dateStr, "yyyy-MM-dd", new Date()), "MMM dd, yyyy");
  } catch {
    return dateStr;
  }
}

// ─── BookingFiscalTable ───────────────────────────────────────────────────────

function BookingFiscalTable({ booking, currencySymbol, invertAmounts = false, itemKeys = null }) {
  const sign = (v) => (invertAmounts ? -(v ?? 0) : (v ?? 0));
  const money = (v) => formatAmount(sign(v), currencySymbol);

  function inScope(key) {
    if (!itemKeys) return true;
    return itemKeys.has(key) || itemKeys.has(String(key)) || itemKeys.has(Number(key));
  }

  // Accommodation rooms scoped by room.system_id
  const rooms = (booking?.rooms ?? []).filter((room) => !itemKeys || inScope(room.system_id));

  // Pickup (booking-level)
  const pickup = booking?.pickup_info ?? null;

  // Extra services scoped by service.system_id
  const extras = (booking?.extra_services ?? []).filter(
    (s) => !itemKeys || inScope(s.system_id),
  );

  // City-tax column only when at least one line actually carries city tax
  const withCityTax =
    rooms.some((room) => (room.days ?? []).some((d) => (d.charges?.city_tax_amount ?? 0) > 0)) ||
    (pickup != null && (pickup.charges?.city_tax_amount ?? 0) > 0) ||
    extras.some((s) => (s.charges?.city_tax_amount ?? 0) > 0);
  const colSpan = withCityTax ? 8 : 6;

  // Cancellation penalty
  const cancellationPenalty = booking?.financial?.payments?.find(
    (p) => p?.payment_type?.code === "013",
  );
  const showCancellationPenalty = !!cancellationPenalty && inScope(cancellationPenalty.system_id);
  const cancellationAmount = showCancellationPenalty ? (cancellationPenalty.amount ?? 0) : 0;

  // Grand totals summed from charges objects
  const allCharges = [
    ...rooms.flatMap((r) => (r.days ?? []).map((d) => d.charges)),
    ...(pickup?.charges ? [pickup.charges] : []),
    ...extras.map((s) => s.charges).filter(Boolean),
  ];
  const grandNet = allCharges.reduce((s, c) => s + (c?.net_amount ?? 0), 0) + cancellationAmount;
  const grandVat = allCharges.reduce((s, c) => s + (c?.vat_amount ?? 0), 0);
  const grandCityTax = allCharges.reduce((s, c) => s + (c?.city_tax_amount ?? 0), 0);
  const grandTotal =
    allCharges.reduce((s, c) => s + (c?.total_amount ?? 0), 0) + cancellationAmount;

  const hasContent =
    rooms.length > 0 || pickup != null || extras.length > 0 || showCancellationPenalty;

  // ── Sub-components ────────────────────────────────────────────────────────

  function ChargesRow({ date, description, charges, indent }) {
    const c = charges ?? {};
    const hasCityTax = (c.city_tax_amount ?? 0) > 0;
    return (
      <PrintTableRow>
        <PrintTableCell muted nowrap indent={indent ?? 0} className="border-r">
          {fmtDate(date)}
        </PrintTableCell>
        <PrintTableCell className="w-full border-r whitespace-normal break-words text-[0.8rem]">
          {description}
        </PrintTableCell>
        <PrintTableCell numeric bold className="border-r">
          {money(c.net_amount)}
        </PrintTableCell>
        <PrintTableCell numeric muted>
          {c.vat_percent != null ? `${c.vat_percent}%` : "—"}
        </PrintTableCell>
        <PrintTableCell numeric muted className="border-r">
          {c.vat_amount != null ? money(c.vat_amount) : "—"}
        </PrintTableCell>
        {withCityTax && (
          <>
            <PrintTableCell numeric muted>
              {hasCityTax ? `${c.city_tax_percent}%` : "—"}
            </PrintTableCell>
            <PrintTableCell numeric muted className="border-r">
              {hasCityTax ? money(c.city_tax_amount) : "—"}
            </PrintTableCell>
          </>
        )}
        <PrintTableCell numeric bold>
          {money(c.total_amount)}
        </PrintTableCell>
      </PrintTableRow>
    );
  }

  function RoomGroup({ room }) {
    const roomTypeName = room?.roomtype?.name ?? "";
    const ratePlanName = room?.rateplan?.short_name ?? room?.rateplan?.name ?? "";
    const rowDescription = [roomTypeName, ratePlanName].filter(Boolean).join(" – ");

    const unitName = room?.unit?.name ?? (room.identifier ?? "").slice(0, 8);
    const guestObj = room?.sharing_persons?.find((p) => p.is_main) ?? room?.guest;
    const guestName = [guestObj?.first_name, guestObj?.last_name].filter(Boolean).join(" ");
    const totalGuests =
      (room.occupancy?.adult_nbr ?? 0) +
      (room.occupancy?.children_nbr ?? 0) +
      (room.occupancy?.infant_nbr ?? 0);

    const days = room.days ?? [];
    const nightCount = days.length;

    return (
      <>
        <PrintTableRow variant="unit">
          <PrintTableCell indent={0} colSpan={colSpan} className="py-1.5 text-slate-700">
            <span className="text-[0.75rem] font-semibold ">
              {unitName}
              {guestName ? ` - ${guestName}` : ""}
              {totalGuests > 0 && <span> ({totalGuests} pax)</span>}
            </span>
            <span className="mx-3 text-slate-300">|</span>
            <span className="text-[0.75rem] ">
              {fmtDate(room.from_date)} – {fmtDate(room.to_date)}
              {nightCount > 0 && (
                <span className="ml-2 ">
                  ({nightCount} night{nightCount !== 1 ? "s" : ""})
                </span>
              )}
            </span>
          </PrintTableCell>
        </PrintTableRow>
        {days.map((day) => (
          <ChargesRow
            key={`${room.identifier}_${day.date}`}
            date={day.date}
            description={rowDescription}
            charges={day.charges}
            indent={1}
          />
        ))}
      </>
    );
  }

  function PickupRow() {
    const location = pickup.selected_option?.location?.description ?? "";
    const vehicle = pickup.selected_option?.vehicle?.description ?? "";
    const description = [location, vehicle].filter(Boolean).join(" — ");
    return (
      <ChargesRow
        date={pickup.date}
        description={description}
        charges={pickup.charges}
        indent={0}
      />
    );
  }

  function CancellationPenaltyRow() {
    return (
      <PrintTableRow>
        <PrintTableCell muted nowrap indent={0} className="border-r">
          {fmtDate(cancellationPenalty.date)}
        </PrintTableCell>
        <PrintTableCell className="w-full border-r whitespace-normal break-words text-[0.8rem]">
          Cancellation Penalty
        </PrintTableCell>
        <PrintTableCell numeric bold className="border-r">
          {money(cancellationAmount)}
        </PrintTableCell>
        <PrintTableCell numeric muted>—</PrintTableCell>
        <PrintTableCell numeric muted className="border-r">-</PrintTableCell>
        {withCityTax && (
          <>
            <PrintTableCell numeric muted>—</PrintTableCell>
            <PrintTableCell numeric muted className="border-r">-</PrintTableCell>
          </>
        )}
        <PrintTableCell numeric bold>
          {money(cancellationAmount)}
        </PrintTableCell>
      </PrintTableRow>
    );
  }

  function GrandTotals() {
    return (
      <PrintTableRow variant="balance">
        <PrintTableCell />
        <PrintTableCell />
        <PrintTableCell numeric className="py-4">
          <p className="text-[0.8rem] font-bold text-slate-900">{money(grandNet)}</p>
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-600 font-medium mt-0.5">
            Net Price
          </p>
        </PrintTableCell>
        <PrintTableCell numeric className="py-4 border-x border-x-slate-200" colSpan={2}>
          <p className="text-[0.8rem] font-bold text-slate-900">{money(grandVat)}</p>
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-600 font-medium mt-0.5">
            VAT
          </p>
        </PrintTableCell>
        {withCityTax && (
          <PrintTableCell numeric className="py-4 border-r border-r-slate-200" colSpan={2}>
            <p className="text-[0.8rem] font-bold text-slate-900">{money(grandCityTax)}</p>
            <p className="text-[0.65rem] uppercase tracking-wide text-slate-600 font-medium mt-0.5">
              City Tax
            </p>
          </PrintTableCell>
        )}
        <PrintTableCell numeric className="py-4">
          <p className="text-[0.85rem] font-bold text-slate-900">{money(grandTotal)}</p>
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-600 font-medium mt-0.5">
            Total Due
          </p>
        </PrintTableCell>
      </PrintTableRow>
    );
  }

  return (
    <section>
      <PrintTable>
        <PrintTableHead>
          <PrintTableRow>
            <PrintTableHeaderCell className="border-r">Date</PrintTableHeaderCell>
            <PrintTableHeaderCell className="border-r w-full">Description</PrintTableHeaderCell>
            <PrintTableHeaderCell numeric className="border-r">Net Price</PrintTableHeaderCell>
            <PrintTableHeaderCell>VAT</PrintTableHeaderCell>
            <PrintTableHeaderCell numeric className="border-r">Amount</PrintTableHeaderCell>
            {withCityTax && <PrintTableHeaderCell>City Tax</PrintTableHeaderCell>}
            {withCityTax && (
              <PrintTableHeaderCell numeric className="border-r">Amount</PrintTableHeaderCell>
            )}
            <PrintTableHeaderCell numeric>Total</PrintTableHeaderCell>
          </PrintTableRow>
        </PrintTableHead>
        <PrintTableBody>
          {!hasContent ? (
            <PrintTableRow>
              <PrintTableCell empty colSpan={colSpan}>
                No line items found for this document.
              </PrintTableCell>
            </PrintTableRow>
          ) : (
            <>
              {rooms.map((room) => (
                <RoomGroup key={room.identifier} room={room} />
              ))}

              {pickup != null && <PickupRow />}

              {extras.map((service) => (
                <ChargesRow
                  key={service.system_id}
                  date={service.start_date}
                  description={service.description}
                  charges={service.charges}
                  indent={0}
                />
              ))}

              {showCancellationPenalty && <CancellationPenaltyRow />}

              <GrandTotals />
            </>
          )}
        </PrintTableBody>
      </PrintTable>
    </section>
  );
}

// ─── BookingPaymentSection ────────────────────────────────────────────────────

function BookingPaymentSection({ booking, selectedDocument, currencySymbol, invertAmounts }) {
  const financial = booking?.financial;
  const symbol = booking?.currency?.symbol ?? currencySymbol;

  return (
    <div className="mt-8 flex flex-col gap-6">
      {!invertAmounts && (
        <ReceiptSection title="Balance Summary">
          <ReceiptRow label="Balance" value={formatAmount(financial?.due_amount, symbol)} />
          <ReceiptRow
            label="Collected"
            value={formatAmount((financial?.collected + financial?.refunds) ?? 0, symbol)}
          />
        </ReceiptSection>
      )}

      {invertAmounts && (
        <ReceiptSection title="Effects on Original Invoice">
          <ReceiptRow
            label="Original invoice total"
            value={formatAmount(selectedDocument?.total_amount ?? 0, symbol)}
          />
          <ReceiptRow
            label="Less: Credit Note"
            value={formatAmount((selectedDocument?.total_amount ?? 0) * -1, symbol)}
          />
          <ReceiptRow label="Revised net amount" value={formatAmount(0, symbol)} />
        </ReceiptSection>
      )}
    </div>
  );
}

// ─── InvoicePreview ───────────────────────────────────────────────────────────

export function InvoicePreview({
  booking,
  property,
  documentNumber,
  invoiceInfo,
  invertAmounts = false,
  locales,
  guestCountryName,
  totalPersons,
  printingService,
  privateNote,
  mode,
}) {
  const currencySymbol = property?.currency?.symbol ?? booking?.currency?.symbol ?? "$";

  const selectedDocument = invoiceInfo?.invoices?.find((i) => i.nbr === documentNumber);

  // Always a Set — empty when document not found so nothing leaks through.
  // null would mean "show all", which is wrong for invoice/credit-note scope.
  const itemKeys = new Set(
    selectedDocument ? selectedDocument.items.map((i) => i.key) : [],
  );

  return (
    <PrintDocument>
      <PrintingHeader
        className="p-0 sm:px-0 pb-8 w-full lg:px-0 max-w-full print:m-0 print:px-0"
        selectedDocument={selectedDocument}
        documentId={documentNumber}
        guestCountryName={guestCountryName}
        totalPersons={totalPersons}
        printingService={printingService}
        privateNote={privateNote}
        booking={booking}
        property={property}
        locales={locales}
        mode={mode}
      />
      <BookingFiscalTable
        booking={booking}
        currencySymbol={currencySymbol}
        invertAmounts={invertAmounts}
        itemKeys={itemKeys}
      />
      <BookingPaymentSection
        booking={booking}
        selectedDocument={selectedDocument}
        currencySymbol={currencySymbol}
        invertAmounts={invertAmounts}
      />
      <FiscalDocumentFooter property={property} />
    </PrintDocument>
  );
}
