/**
 * The `IrBookingEngine` props a booking URL's search params set.
 *
 * @param {Record<string, string | undefined>} searchParams
 */
export const bookingEngineProps = ({ checkin, checkout, adults, source, children, u, ages, stag, aff, cur, nights, lang, loyalty, promo, agent }) => ({
    nights,
    cur,
    aff,
    stag,
    roomtype_id: u,
    fromDate: checkin,
    toDate: checkout,
    adultCount: adults,
    childrenCount: children,
    language: lang,
    ages,
    source,
    coupon: promo,
    loyalty,
    agent_code: agent,
});
