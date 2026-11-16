/**
 * Whether this deployment is a testing one, from the server-only `APP_ENV` variable.
 * Anything else, including unset, counts as not testing, so a server missing its
 * configuration behaves like production. `NODE_ENV` can't answer this: a testing
 * server runs a production build.
 */
export const isTestingEnvironment = () => process.env.APP_ENV?.trim().toLowerCase() === "testing";

const PRODUCTION_BOOKING_ENGINE_SCRIPT = "https://wb-cmp.igloorooms.com/be/dist/iglooroom/iglooroom.esm.js";
const TESTING_BOOKING_ENGINE_SCRIPT = "https://david1chowaifaty.github.io/igloo-calendar-main-web/be-dist/iglooroom/iglooroom.esm.js";

/** The `<ir-be>` web component loader for this deployment. */
export const bookingEngineScriptUrl = () =>
    isTestingEnvironment() ? TESTING_BOOKING_ENGINE_SCRIPT : PRODUCTION_BOOKING_ENGINE_SCRIPT;

const DEFAULT_SITE_DOMAIN = "bookingmystay.com";

/**
 * The domain property sites live under, from the server-only `SITE_DOMAIN` variable:
 * `test.bookingmystay.com` on a testing deployment. Unset means production's.
 */
export const siteDomain = () => process.env.SITE_DOMAIN?.trim().toLowerCase() || DEFAULT_SITE_DOMAIN;

/** A property's own site on this deployment, e.g. `https://hotel.bookingmystay.com/signin`. */
export const siteUrl = (permaLink, path = "") => `https://${permaLink}.${siteDomain()}${path}`;

/** Whether `host` is a property's site on this deployment: one label under the site domain. */
export const isPropertySite = (host) => {
    const suffix = `.${siteDomain()}`;
    const name = host.toLowerCase();
    return name.endsWith(suffix) && /^[a-z0-9-]+$/.test(name.slice(0, -suffix.length));
};
