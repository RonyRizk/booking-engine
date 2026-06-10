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
import { cn, formatAmount, haveCityTax } from "@/lib/utils";
import moment from "moment";
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
    return moment(dateStr, 'YYYY-MM-DD').locale('en').format('MMM DD, YYYY');
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

  const rowSign = (tx) => (tx?.CREDIT > 0 ? -1 : 1);
  const applySign = (value, sign = 1) =>
    (invertAmounts ? -1 : 1) * sign * (value ?? 0);
  const money = (value, sign = 1) =>
    formatAmount(applySign(value, sign), currencySymbol);

  const totals = transactions.reduce(
    (acc, tx) => {
      const sign = rowSign(tx);
      return {
        net: acc.net + sign * (tx.NET_AMOUNT ?? 0),
        tax: acc.tax + sign * (tx.TAX_AMOUNT ?? 0),
        total: acc.total + sign * (tx.TOTAL_AMOUNT ?? 0),
      };
    },
    { net: 0, tax: 0, total: 0 },
  );

  // ── Row renderers ──────────────────────────────────────────────────────────

  function TxRow({ tx, indent = 0, withCityTax, isLast }) {
    const sign = rowSign(tx);
    return (
      <PrintTableRow>
        <PrintTableCell muted nowrap indent={indent} className={cn("border-r ",
          { "border-b-black": isLast }
        )}>
          {formatEntryDate(tx.SERVICE_DATE)}
        </PrintTableCell>
        <PrintTableCell className={cn("w-full border-r whitespace-normal break-words text-[0.8rem]", { "border-b-black": isLast })}>
          {tx.DESCRIPTION}
        </PrintTableCell>
        <PrintTableCell numeric bold className={cn("border-r",
          { "border-b-black": isLast }
        )}>
          {money(tx.NET_AMOUNT, sign)}
        </PrintTableCell>
        <PrintTableCell numeric muted className={cn(" border-l-slate-200", { "border-b-black": isLast })}>
          {tx.VAT_PERCENT != null ? `${tx.VAT_PERCENT}%` : "—"}
        </PrintTableCell>
        <PrintTableCell numeric muted className={cn("border-r", { "border-b-black": isLast })}>
          {money(tx.VAT_AMOUNT, sign)}
        </PrintTableCell>
        {withCityTax && (
          <>
            <PrintTableCell numeric muted className={cn(" border-l-slate-200", { "border-b-black": isLast })}>
              {tx.CITY_TAX_PERCENT ? `${tx.CITY_TAX_PERCENT}%` : ""}
            </PrintTableCell>
            <PrintTableCell numeric muted className={cn("border-r", { "border-b-black": isLast })}>
              {(tx.CITY_TAX_PERCENT || tx.CITY_TAX_AMOUNT)
                ? money(tx.CITY_TAX_AMOUNT, sign)
                : ""}
            </PrintTableCell>
          </>
        )}
        <PrintTableCell numeric bold className={cn({ "border-b-black": isLast })}>
          {money(tx.TOTAL_AMOUNT, sign)}
        </PrintTableCell>
      </PrintTableRow>
    );
  }

  function UnitGroup({ group, withCityTax, showLast }) {
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
            isLast={idx === group.subRows.length - 1 && showLast}
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
        {group.subRows.length >= 1 && (
          <PrintTableRow variant="booking">
            <PrintTableCell
              colSpan={withCityTax ? 8 : 6}
              bold
              className="py-2 px-3 text-[0.8rem]  text-slate-700"
            >
              Booking #{group.BOOK_NBR}
            </PrintTableCell>
          </PrintTableRow>
        )}
        {group.subRows.map((item, i) => {
          const isLast = i === group.subRows.length - 1
          if ("subRows" in item && !("BOOK_NBR" in item))
            return (
              <UnitGroup
                showLast={isLast}
                key={`unit-${item.PR_ID ?? i}`}
                group={item}
                withCityTax={withCityTax}
              />
            );
          return (
            <TxRow
              isLast={isLast}
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
        isLast={true}
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
  const withCityTax = transactions?.some(t => t.CITY_TAX_PERCENT > 0);

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
