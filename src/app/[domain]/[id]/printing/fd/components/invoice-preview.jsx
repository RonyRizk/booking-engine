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

/**
 * Renders the fiscal line-item table driven by `booking.financial_snapshot.entries`.
 *
 * charge_source values:
 *   0 = accommodation — grouped by room_identifier; each entry is one night
 *   1 = pickup
 *   2 = extra service
 *
 * All amounts come directly from the snapshot (net_amount, vat_amount,
 * city_tax_amount, total_amount) — no re-derivation from property tax rates.
 *
 * itemKeys filtering:
 *   - accommodation: matched via room.system_id (bridged through room.identifier)
 *   - pickup / extras: matched via entry.rel_entity_key
 *   Both sides are tested as-is and as String/Number to handle type mismatches.
 */
function BookingFiscalTable({ booking, currencySymbol, invertAmounts = false, itemKeys = null }) {
  const sign = (v) => (invertAmounts ? -(v ?? 0) : (v ?? 0));
  const money = (v) => formatAmount(sign(v), currencySymbol);

  // Map room.identifier (UUID) → room for header info and itemKeys bridging
  const roomByIdentifier = new Map();
  for (const room of booking?.rooms ?? []) {
    if (room.identifier) roomByIdentifier.set(room.identifier, room);
  }

  // Check both string and number forms of a key against the Set
  function inScope(key) {
    if (!itemKeys) return true;
    return itemKeys.has(key) || itemKeys.has(String(key)) || itemKeys.has(Number(key));
  }

  function entryInScope(entry) {
    if (!itemKeys) return true;
    if (entry.charge_source === 0) {
      const room = roomByIdentifier.get(entry.room_identifier);
      return room != null && inScope(room.system_id);
    }
    return inScope(entry.rel_entity_key);
  }

  const allEntries = booking?.financial_snapshot?.entries ?? [];
  const entries = allEntries.filter(entryInScope);

  const accomEntries = entries.filter((e) => e.charge_source === 0);
  const pickupEntries = entries.filter((e) => e.charge_source === 1);
  const extraEntries = entries.filter((e) => e.charge_source === 2);

  // City-tax column only when at least one entry actually carries city tax
  const withCityTax = entries.some((e) => (e.city_tax_amount ?? 0) > 0);
  const colSpan = withCityTax ? 8 : 6;

  // Group accommodation entries by room_identifier, preserving insertion order
  const roomGroups = new Map();
  for (const entry of accomEntries) {
    const key = entry.room_identifier ?? `__anon__${entry.bh_financial_detail_id}`;
    if (!roomGroups.has(key)) roomGroups.set(key, []);
    roomGroups.get(key).push(entry);
  }

  // Cancellation penalty lives outside the snapshot
  const cancellationPenalty = booking?.financial?.payments?.find(
    (p) => p?.payment_type?.code === "013",
  );
  const showCancellationPenalty = !!cancellationPenalty && inScope(cancellationPenalty.system_id);
  const cancellationAmount = showCancellationPenalty ? (cancellationPenalty.amount ?? 0) : 0;

  // Grand totals summed directly from snapshot values
  const grandNet = entries.reduce((s, e) => s + (e.net_amount ?? 0), 0) + cancellationAmount;
  const grandVat = entries.reduce((s, e) => s + (e.vat_amount ?? 0), 0);
  const grandCityTax = entries.reduce((s, e) => s + (e.city_tax_amount ?? 0), 0);
  const grandTotal = entries.reduce((s, e) => s + (e.total_amount ?? 0), 0) + cancellationAmount;

  const hasContent = entries.length > 0 || showCancellationPenalty;

  // ── Sub-components ────────────────────────────────────────────────────────

  function EntryRow({ entry, description, indent }) {
    const hasCityTax = (entry.city_tax_amount ?? 0) > 0;
    return (
      <PrintTableRow>
        <PrintTableCell muted nowrap indent={indent ?? 0} className="border-r">
          {fmtDate(entry.service_date)}
        </PrintTableCell>
        <PrintTableCell className="w-full border-r whitespace-normal break-words text-[0.8rem]">
          {description ?? entry.description}
        </PrintTableCell>
        <PrintTableCell numeric bold className="border-r">
          {money(entry.net_amount)}
        </PrintTableCell>
        <PrintTableCell numeric muted>
          {entry.vat_percent != null ? `${entry.vat_percent}%` : "—"}
        </PrintTableCell>
        <PrintTableCell numeric muted className="border-r">
          {entry.vat_amount != null ? money(entry.vat_amount) : "—"}
        </PrintTableCell>
        {withCityTax && (
          <>
            <PrintTableCell numeric muted>
              {hasCityTax ? `${entry.city_tax_percent}%` : "—"}
            </PrintTableCell>
            <PrintTableCell numeric muted className="border-r">
              {hasCityTax ? money(entry.city_tax_amount) : "—"}
            </PrintTableCell>
          </>
        )}
        <PrintTableCell numeric bold>
          {money(entry.total_amount)}
        </PrintTableCell>
      </PrintTableRow>
    );
  }

  function RoomGroup({ identifier, groupEntries }) {
    const room = roomByIdentifier.get(identifier);

    const roomTypeName = room?.roomtype?.name ?? "";
    const ratePlanName = room?.rateplan?.short_name ?? room?.rateplan?.name ?? "";
    const rowDescription = [roomTypeName, ratePlanName].filter(Boolean).join(" – ");

    const unitName = room?.unit?.name ?? identifier.slice(0, 8);
    const guestObj = room?.sharing_persons?.find((p) => p.is_main) ?? room?.guest;
    const guestName = [guestObj?.first_name, guestObj?.last_name].filter(Boolean).join(" ");
    const totalGuests = room
      ? (room.occupancy?.adult_nbr ?? 0) +
        (room.occupancy?.children_nbr ?? 0) +
        (room.occupancy?.infant_nbr ?? 0)
      : null;

    const fromDate = room?.from_date ?? groupEntries[0]?.service_date;
    const toDate = room?.to_date ?? groupEntries[groupEntries.length - 1]?.service_date;
    const nightCount = groupEntries.length;

    return (
      <>
        <PrintTableRow variant="unit">
          <PrintTableCell indent={0} colSpan={colSpan} className="py-1.5">
            <span className="text-[0.75rem] font-semibold text-slate-700">
              {unitName}
              {guestName ? ` - ${guestName}` : ""}
              {totalGuests != null && <span> ({totalGuests} pax)</span>}
            </span>
            <span className="mx-3 text-slate-300">|</span>
            <span className="text-[0.75rem] text-slate-600">
              {fmtDate(fromDate)} – {fmtDate(toDate)}
              {nightCount > 0 && (
                <span className="ml-2 text-slate-400">
                  ({nightCount} night{nightCount !== 1 ? "s" : ""})
                </span>
              )}
            </span>
          </PrintTableCell>
        </PrintTableRow>
        {groupEntries.map((entry) => (
          <EntryRow
            key={entry.bh_financial_detail_id}
            entry={entry}
            description={rowDescription}
            indent={1}
          />
        ))}
      </>
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
        <PrintTableCell numeric muted className="border-r">—</PrintTableCell>
        {withCityTax && (
          <>
            <PrintTableCell numeric muted>—</PrintTableCell>
            <PrintTableCell numeric muted className="border-r">—</PrintTableCell>
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
              {[...roomGroups.entries()].map(([identifier, groupEntries]) => (
                <RoomGroup key={identifier} identifier={identifier} groupEntries={groupEntries} />
              ))}

              {pickupEntries.map((entry) => (
                <EntryRow key={entry.bh_financial_detail_id} entry={entry} indent={0} />
              ))}

              {extraEntries.map((entry) => (
                <EntryRow key={entry.bh_financial_detail_id} entry={entry} indent={0} />
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
        className="p-0 pb-8 w-full lg:px-0 max-w-full print:m-0 print:px-0"
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
