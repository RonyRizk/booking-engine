/**
 * Fiscal document table — renders grouped city-ledger transactions.
 *
 * Built on PrintTable composition primitives so the same row/cell building
 * blocks can be reused in other print documents.
 *
 * Data is grouped into: Booking → Unit (room) → individual rows, oldest-first.
 * Pass invertAmounts=true for credit notes to negate all monetary values.
 */

import { Fragment } from "react";
import { formatAmount } from "@/lib/utils";
import { format, parse } from "date-fns";
import { groupData } from "../utils/group-data";
import {
  PrintTable,
  PrintTableBody,
  PrintTableCell,
  PrintTableHead,
  PrintTableHeaderCell,
  PrintTableRow,
} from "./print-table";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildLookups(property) {
  const prIdDict = new Map();
  const roomTypesDict = new Map();
  const rateplanDict = new Map();
  for (const rt of property?.roomtypes ?? []) {
    roomTypesDict.set(rt.id, rt);
    for (const room of rt.physicalrooms ?? []) prIdDict.set(room.id, room);
    for (const rp of rt.rateplans ?? []) rateplanDict.set(rp.id, rp);
  }
  return { prIdDict, roomTypesDict, rateplanDict };
}

function formatEntryDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return format(parse(dateStr, "yyyy-MM-dd", new Date()), "MMM dd, yyyy");
  } catch {
    return dateStr;
  }
}

// ─── FiscalDocumentTable ──────────────────────────────────────────────────────

export function FiscalDocumentTable({
  transactions = [],
  currencySymbol = "$",
  invertAmounts = false,
  property,
}) {
  const { prIdDict, roomTypesDict, rateplanDict } = buildLookups(property);

  const applySign = (value) => (invertAmounts ? -(value ?? 0) : (value ?? 0));
  const money = (value) => formatAmount(applySign(value), currencySymbol);

  const totals = transactions.reduce(
    (acc, tx) => ({
      net: acc.net + (tx.NET_AMOUNT ?? 0),
      tax: acc.tax + (tx.TAX_AMOUNT ?? 0),
      total: acc.total + (tx.TOTAL_AMOUNT ?? 0),
    }),
    { net: 0, tax: 0, total: 0 },
  );

  // ── Row renderers ──────────────────────────────────────────────────────────

  function TxRow({ tx, indent = 0, withCityTax }) {
    return (
      <PrintTableRow>
        <PrintTableCell muted nowrap indent={indent} className={"border-r"}>
          {formatEntryDate(tx.SERVICE_DATE)}
        </PrintTableCell>
        <PrintTableCell className="w-full border-r whitespace-normal break-words text-[0.8rem]">
          {tx.DESCRIPTION}
        </PrintTableCell>
        <PrintTableCell numeric bold className={"border-r"}>
          {money(tx.NET_AMOUNT)}
        </PrintTableCell>
        <PrintTableCell numeric muted className=" border-l-slate-200">
          {tx.VAT_PERCENT != null ? `${tx.VAT_PERCENT}%` : "—"}
        </PrintTableCell>
        <PrintTableCell numeric muted className={"border-r"}>
          {money(tx.VAT_AMOUNT)}
        </PrintTableCell>
        {withCityTax && (
          <>
            <PrintTableCell numeric muted className=" border-l-slate-200">
              {tx.CITY_TAX_PERCENT != null ? `${tx.CITY_TAX_PERCENT}%` : "—"}
            </PrintTableCell>
            <PrintTableCell numeric muted className={"border-r"}>
              {tx.CITY_TAX_PERCENT != null || tx.CITY_TAX_AMOUNT != null
                ? money(tx.CITY_TAX_AMOUNT)
                : "—"}
            </PrintTableCell>
          </>
        )}
        <PrintTableCell numeric bold>
          {money(tx.TOTAL_AMOUNT)}
        </PrintTableCell>
      </PrintTableRow>
    );
  }

  function UnitGroup({ group, withCityTax }) {
    const roomName = prIdDict.get(group.PR_ID)?.name ?? "";
    const roomTypeName = roomTypesDict.get(group.ROOM_CATEGORY_ID)?.name ?? "";
    const rateplanName = rateplanDict.get(group.RATE_PLAN_ID)?.short_name ?? "";
    const description = [roomTypeName, rateplanName]
      .filter(Boolean)
      .join(" - ");

    return (
      <Fragment>
        <PrintTableRow variant="unit">
          <PrintTableCell
            indent={1}
            colSpan={withCityTax ? 8 : 6}
            className="py-1.5"
          >
            <span className="text-[0.75rem] font-semibold text-slate-700">
              {roomName} - {group.GUEST_FIRST_NAME} {group.GUEST_LAST_NAME} (
              {group.occupancy} pax)
            </span>
            <span className="mx-3 text-slate-300">|</span>
            <span className="text-[0.75rem] text-slate-600">
              {formatEntryDate(group.FROM_DATE)} –{" "}
              {formatEntryDate(group.TO_DATE)}
            </span>
          </PrintTableCell>
        </PrintTableRow>
        {group.subRows.map((tx, idx) => (
          <TxRow
            key={`tx-${tx.CL_TX_ID ?? idx}-2-${idx}`}
            tx={{ ...tx, DESCRIPTION: description }}
            indent={2}
            withCityTax={withCityTax}
          />
        ))}
      </Fragment>
    );
  }

  function BookingGroup({ group, withCityTax }) {
    return (
      <Fragment>
        {group.subRows.length > 1 && (
          <PrintTableRow variant="booking">
            <PrintTableCell
              colSpan={withCityTax ? 8 : 6}
              bold
              className="py-2 px-3 text-[0.8rem] text-slate-700"
            >
              Booking #{group.BOOK_NBR}
            </PrintTableCell>
          </PrintTableRow>
        )}
        {group.subRows.map((item, i) => {
          if ("subRows" in item && !("BOOK_NBR" in item))
            return (
              <UnitGroup
                key={`unit-${item.PR_ID ?? i}`}
                group={item}
                withCityTax={withCityTax}
              />
            );
          return (
            <TxRow
              tx={item}
              key={`tx-${item.CL_TX_ID ?? i}-${1}-${i}`}
              indent={1}
              withCityTax={withCityTax}
            />
          );
        })}
      </Fragment>
    );
  }

  function renderTopLevelItem({ item, i, withCityTax }) {
    if ("subRows" in item && "BOOK_NBR" in item)
      return (
        <BookingGroup
          key={`booking-${item.BOOK_NBR ?? i}`}
          group={item}
          withCityTax={withCityTax}
        />
      );
    return (
      <TxRow
        key={`tx-${item.CL_TX_ID ?? i}-0-${i}`}
        tx={item}
        indent={0}
        withCityTax={withCityTax}
      />
    );
  }

  function Totals() {
    return (
      <PrintTableRow variant="balance">
        <PrintTableCell />
        <PrintTableCell />
        <PrintTableCell numeric className="py-4">
          <p className="text-[0.8rem] font-bold text-slate-900">
            {money(totals.net)}
          </p>
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-600 font-medium mt-0.5">
            Net Price

          </p>
        </PrintTableCell>
        {/* <PrintTableCell className="border-l-2 border-l-slate-200" /> */}
        <PrintTableCell
          numeric
          className="py-4 border-x  border-x-slate-200"
          colSpan={2}
        >
          <p className="text-[0.8rem] font-bold text-slate-900">
            {money(totals.tax)}
          </p>
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-600 font-medium mt-0.5">
            Taxes
          </p>
        </PrintTableCell>
        {withCityTax && (
          <>
            <PrintTableCell />
            <PrintTableCell />
          </>
        )}
        <PrintTableCell numeric className="py-4">
          <p className="text-[0.85rem] font-bold text-slate-900">
            {money(totals.total)}
          </p>
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-600 font-medium mt-0.5">
            Grand Total
          </p>
        </PrintTableCell>
      </PrintTableRow>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const grouped = groupData(transactions);
  const withCityTax = property?.taxes?.[1]?.pct > 0;

  return (
    <section>
      <PrintTable>
        <PrintTableHead>
          <PrintTableRow>
            <PrintTableHeaderCell className={"border-r"}>
              Date
            </PrintTableHeaderCell>
            <PrintTableHeaderCell className={"border-r w-full"}>
              Description
            </PrintTableHeaderCell>
            <PrintTableHeaderCell numeric className={"border-r"}>
              Net Price
            </PrintTableHeaderCell>
            <PrintTableHeaderCell>VAT</PrintTableHeaderCell>
            <PrintTableHeaderCell numeric className={"border-r"}>
              Amount
            </PrintTableHeaderCell>
            {withCityTax && (
              <PrintTableHeaderCell>City Tax</PrintTableHeaderCell>
            )}
            {withCityTax && (
              <PrintTableHeaderCell numeric className="border-r">
                Amount
              </PrintTableHeaderCell>
            )}
            <PrintTableHeaderCell numeric>Total</PrintTableHeaderCell>
          </PrintTableRow>
        </PrintTableHead>
        <PrintTableBody>
          {transactions.length === 0 ? (
            <PrintTableRow>
              <PrintTableCell empty colSpan={8}>
                No transactions found for this document.
              </PrintTableCell>
            </PrintTableRow>
          ) : (
            <>
              {grouped.map((item, i) =>
                renderTopLevelItem({ item, i, withCityTax }),
              )}
              <Totals />
            </>
          )}
        </PrintTableBody>
      </PrintTable>
    </section>
  );
}
