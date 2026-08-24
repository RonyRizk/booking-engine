/**
 * Groups a flat array of transaction rows into a two-level hierarchy,
 * then sorts every level so the oldest SERVICE_DATE appears first.
 *
 * Level 1 — Booking groups:
 *   Rows that share the same BOOK_NBR are collapsed into a parent object
 *   { BOOK_NBR, subRows: [...] }. Rows with no BOOK_NBR are kept flat.
 *   The top-level array is sorted by each item's oldest SERVICE_DATE so that
 *   a booking group is "pulled up" by whichever of its rows has the earliest date.
 *
 * Level 2 — Unit groups (inside each booking's subRows):
 *   Within a booking, rows that share the same BSA_REF (the room-stay
 *   reference) are further collapsed into { BSA_REF, subRows: [...] }.
 *   Extra services carry the BSA_REF of the room they were sold against, so
 *   they land under that room alongside its accommodation rows.
 *   Rows with no BSA_REF (e.g. pickup, discounts, adjustments) are kept flat
 *   inside the booking's subRows.
 *   The booking's subRows array is sorted by each item's oldest SERVICE_DATE
 *   so that a unit group is pulled up by its earliest row.
 *
 *   The rows inside each unit group are also sorted oldest-first, except that
 *   the accommodation nights are kept together as one contiguous block: extras
 *   dated before the first night render above it, all other extras below it.
 *
 *   The unit header fields (PR_ID, guest, occupancy, stay dates, room type,
 *   rate plan) are derived from the group's accommodation rows — the ones
 *   carrying a PR_ID — since extras have none of that information.
 *
 * @param  rows - Raw transaction rows from the API.
 * @returns {Array} Grouped and sorted rows ready for rendering.
 */
export const groupData = (rows) => {
  // ── Sorting helper ────────────────────────────────────────────────────────

  /**
   * Returns the oldest SERVICE_DATE found within an item.
   * If the item is a group (has subRows), recurse to find the minimum date
   * across all descendants. If it is a plain row, return its own SERVICE_DATE.
   */
  const getOldestDate = item => {
    if (item.subRows && item.subRows.length > 0) {
      return item.subRows.reduce((oldest, child) => {
        const childDate = getOldestDate(child);
        if (!oldest) return childDate;
        return childDate < oldest ? childDate : oldest;
      }, '');
    }
    return item.SERVICE_DATE ?? '';
  };

  const sortByOldestDate = arr => {
    return arr.sort((a, b) => {
      const dateA = getOldestDate(a);
      const dateB = getOldestDate(b);
      return dateA.localeCompare(dateB);
    });
  };

  // ── Level 1: split rows into "no booking" vs "has booking" ──────────────

  const standalone = [];
  const bookingMap = new Map();

  for (const row of rows) {
    if (!row.BOOK_NBR) {
      standalone.push(row);
    } else {
      if (!bookingMap.has(row.BOOK_NBR)) {
        bookingMap.set(row.BOOK_NBR, []);
      }
      bookingMap.get(row.BOOK_NBR).push(row);
    }
  }

  /**
   * Orders the rows of a unit group so the accommodation nights stay together
   * as one uninterrupted block. Extras dated before the first night are listed
   * ahead of it; every other extra follows the block. Both sides keep the
   * oldest-first ordering they already have.
   */
  const orderUnitRows = (sorted, roomRows) => {
    if (roomRows.length === 0 || roomRows.length === sorted.length) return sorted;

    const firstNight = roomRows[0].SERVICE_DATE ?? '';
    const before = [];
    const after = [];
    for (const row of sorted) {
      if (row.PR_ID) continue;
      if ((row.SERVICE_DATE ?? '') < firstNight) before.push(row);
      else after.push(row);
    }
    return [...before, ...roomRows, ...after];
  };

  // ── Level 2: within each booking, group rows by BSA_REF (room stay) ─────

  const groupByUnit = bookingRows => {
    const unitStandalone = [];
    const unitMap = new Map();

    for (const row of bookingRows) {
      if (!row.BSA_REF) {
        unitStandalone.push(row);
      } else {
        if (!unitMap.has(row.BSA_REF)) {
          unitMap.set(row.BSA_REF, []);
        }
        unitMap.get(row.BSA_REF).push(row);
      }
    }

    const unitGroups = [];
    for (const [bsaRef, subRows] of unitMap.entries()) {
      const sorted = sortByOldestDate(subRows);
      // Extras share the room's BSA_REF but carry no room information, so the
      // header is always derived from the accommodation rows when present.
      const roomRows = sorted.filter(row => row.PR_ID);
      const first = roomRows[0] ?? sorted[0];
      const last = roomRows[roomRows.length - 1] ?? sorted[sorted.length - 1];
      unitGroups.push({
        BSA_REF: bsaRef,
        subRows: orderUnitRows(sorted, roomRows),
        PR_ID: first.PR_ID ?? null,
        occupancy: (first.ADULTS_NBR ?? 0) + (first.CHILD_NBR ?? 0) + (first.INFANT_NBR ?? 0),
        GUEST_FIRST_NAME: first.GUEST_FIRST_NAME ?? '',
        GUEST_LAST_NAME: first.GUEST_LAST_NAME ?? '',
        FROM_DATE: first.FROM_DATE ?? '',
        TO_DATE: last.TO_DATE ?? '',
        ROOM_CATEGORY_ID: first.ROOM_CATEGORY_ID ?? 0,
        ROOM_TYPE_ID: first.ROOM_TYPE_ID ?? 0,
        RATE_PLAN_ID: first.RATE_PLAN_ID ?? 0,
      });
    }

    return sortByOldestDate([...unitStandalone, ...unitGroups]);
  };

  // ── Assemble final result ─────────────────────────────────────────────────

  const bookingGroups = [];
  for (const [bookNbr, bookingRows] of bookingMap.entries()) {
    bookingGroups.push({
      BOOK_NBR: bookNbr,
      subRows: groupByUnit(bookingRows),
    });
  }
  return sortByOldestDate([...standalone, ...bookingGroups]);
};
