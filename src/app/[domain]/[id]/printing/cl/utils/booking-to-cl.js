/**
 * Converts a booking object into the CL transaction schema used by FiscalDocumentTable,
 * filtering out items already invoiced (present in the CL result).
 *
 * Lock detection:
 *   - Room days: matched by BSA_REF (= room.identifier) + SERVICE_DATE
 *   - Extras / pickup: matched by REL_ENTITY_KEY (= system_id)
 *
 * Only items whose agent.id matches agentId are included.
 */

import { ClTxTypeCode } from "@/lib/enums";

function buildLockedSets(clTxs) {
  const lockedDays = new Set();
  const lockedEntities = new Set();
  for (const tx of clTxs) {
    if (!tx.IS_LOCKED) continue;
    if (tx.BSA_REF && tx.SERVICE_DATE) {
      lockedDays.add(`${tx.BSA_REF}|${tx.SERVICE_DATE}`);
    }
    if (tx.REL_ENTITY_KEY != null) {
      lockedEntities.add(String(tx.REL_ENTITY_KEY));
    }
  }
  return { lockedDays, lockedEntities };
}

function chargesFromObject(charges) {
  return {
    NET_AMOUNT: charges?.net_amount ?? 0,
    TAX_AMOUNT: charges?.tax_amount ?? 0,
    VAT_AMOUNT: charges?.vat_amount ?? 0,
    VAT_PERCENT: charges?.vat_percent ?? 0,
    CITY_TAX_AMOUNT: charges?.city_tax_amount ?? 0,
    CITY_TAX_PERCENT: charges?.city_tax_percent ?? 0,
    TOTAL_AMOUNT: charges?.total_amount ?? 0,
  };
}

export function convertBookingToCL({ booking, agentId, clTxs, setupEntries }) {
  const { lockedDays, lockedEntities } = buildLockedSets(clTxs);
  const svcCategory = setupEntries._SVC_CATEGORY;
  const transactions = [];

  // ── Rooms ──────────────────────────────────────────────────────────────────
  for (const room of booking.rooms ?? []) {
    if (!room.agent || String(room.agent.id) !== String(agentId)) continue;

    for (const day of room.days ?? []) {
      const lockKey = `${room.identifier}|${day.date}`;
      if (lockedDays.has(lockKey)) continue;

      transactions.push({
        BOOK_NBR: booking.booking_nbr,
        AGENCY_ID: agentId,
        PR_ID: room.unit?.id ?? null,
        ROOM_CATEGORY_ID: room.roomtype?.id ?? 0,
        ROOM_TYPE_ID: room.roomtype?.id ?? 0,
        RATE_PLAN_ID: room.rateplan?.id ?? 0,
        SERVICE_DATE: day.date,
        FROM_DATE: room.from_date,
        TO_DATE: room.to_date,
        DESCRIPTION: '',
        GUEST_FIRST_NAME: room.guest?.first_name ?? booking.guest?.first_name ?? '',
        GUEST_LAST_NAME: room.guest?.last_name ?? booking.guest?.last_name ?? '',
        ADULTS_NBR: room.occupancy?.adult_nbr ?? 0,
        CHILD_NBR: room.occupancy?.children_nbr ?? 0,
        INFANT_NBR: room.occupancy?.infant_nbr ?? 0,
        ...chargesFromObject(day.charges),
      });
    }
  }

  // ── Extra services ─────────────────────────────────────────────────────────
  for (const service of booking.extra_services ?? []) {
    if (!service.agent || String(service.agent.id) !== String(agentId)) continue;
    if (lockedEntities.has(String(service.system_id))) continue;

    transactions.push({
      BOOK_NBR: booking.booking_nbr,
      AGENCY_ID: agentId,
      PR_ID: null,
      ROOM_CATEGORY_ID: null,
      ROOM_TYPE_ID: null,
      RATE_PLAN_ID: null,
      SERVICE_DATE: service.start_date,
      FROM_DATE: service.start_date,
      TO_DATE: service.end_date,
      DESCRIPTION: `${service.category?.code ? svcCategory[service.category.code] + `${service.description ? ": " : ""}` : ""}${service.description}`,
      GUEST_FIRST_NAME: booking.guest?.first_name ?? '',
      GUEST_LAST_NAME: booking.guest?.last_name ?? '',
      ADULTS_NBR: 0,
      CHILD_NBR: 0,
      INFANT_NBR: 0,
      ...chargesFromObject(service.charges),
    });
  }

  // ── Pickup ─────────────────────────────────────────────────────────────────
  const pickup = booking.pickup_info;
  if (pickup && pickup.agent && String(pickup.agent.id) === String(agentId)) {
    if (!lockedEntities.has(String(pickup.system_id))) {
      const desc = 'Airport Pickup';

      transactions.push({
        BOOK_NBR: booking.booking_nbr,
        AGENCY_ID: agentId,
        PR_ID: null,
        ROOM_CATEGORY_ID: null,
        ROOM_TYPE_ID: null,
        RATE_PLAN_ID: null,
        SERVICE_DATE: pickup.date,
        FROM_DATE: pickup.date,
        TO_DATE: pickup.date,
        DESCRIPTION: desc,
        GUEST_FIRST_NAME: booking.guest?.first_name ?? '',
        GUEST_LAST_NAME: booking.guest?.last_name ?? '',
        ADULTS_NBR: 0,
        CHILD_NBR: 0,
        INFANT_NBR: 0,
        ...chargesFromObject(pickup.charges),
      });
    }
  }
  const UNLOCKED_SUPPLEMENTAL_TYPES = new Set([
    ClTxTypeCode.Discount,
    ClTxTypeCode.Adjustment,
    ClTxTypeCode.CancellationPenalty,
  ]);
  const supplemental = clTxs.filter(
    tx => !tx.IS_LOCKED && UNLOCKED_SUPPLEMENTAL_TYPES.has(tx.CL_TX_TYPE_CODE),
  );
  return [...transactions, ...supplemental];
}
