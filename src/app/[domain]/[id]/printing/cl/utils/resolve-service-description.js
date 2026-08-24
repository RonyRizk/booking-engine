/**
 * CL rows sourced from a booking service (REL_ENTITY = "TBL_BSE") carry their
 * service category as a raw setup code inside DESCRIPTION, in one of two forms:
 *
 *   "SVC_CATEGORY"              — category only
 *   "SVC_CATEGORY:description"  — category plus free text
 *
 * These helpers swap that code for its localized label from the _SVC_CATEGORY
 * setup table (same source `booking-to-cl.js` uses when synthesizing rows).
 * If the code has no entry in the table, the description is returned untouched.
 */

const BOOKING_SERVICE_ENTITY = 'TBL_BSE';

/**
 * @param {string} description - Raw DESCRIPTION from the CL row.
 * @param {Record<string, string>} svcCategory - _SVC_CATEGORY entries, keyed by code.
 * @returns {string} Description with the category code replaced by its label.
 */
export function resolveServiceDescription(description, svcCategory) {
  if (!description) return description;

  const separatorIndex = description.indexOf(':');
  const code = (
    separatorIndex === -1 ? description : description.slice(0, separatorIndex)
  ).trim();

  const label = svcCategory?.[code];
  if (!label) return description;

  const rest =
    separatorIndex === -1 ? '' : description.slice(separatorIndex + 1).trim();
  return rest ? `${label}: ${rest}` : label;
}

/**
 * Maps a transaction list, rewriting the description of booking-service rows only.
 *
 * @param {Array} transactions - CL transaction rows.
 * @param {Record<string, string>} svcCategory - _SVC_CATEGORY entries, keyed by code.
 * @returns {Array} Rows with resolved descriptions.
 */
export function resolveServiceDescriptions(transactions, svcCategory) {
  if (!svcCategory) return transactions ?? [];
  return (transactions ?? []).map(tx =>
    tx.REL_ENTITY === BOOKING_SERVICE_ENTITY
      ? { ...tx, DESCRIPTION: resolveServiceDescription(tx.DESCRIPTION, svcCategory) }
      : tx,
  );
}
