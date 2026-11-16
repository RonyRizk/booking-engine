import { CommonServices } from "./services/common.service";
import { PrintingService } from "./services/printing.service";
import { calculateDaysBetweenDates, formatPropertyPhone } from "./utils";
import { EMAIL_LABELS, fetchLabels } from "./labels";

const baseUrl = "https://gateway.igloorooms.com/IRBE";
const alphaBaseUrl = "https://gateway.igloorooms.com/IRALPHA";

/**
 * Reads the 'ConnectedUserType' header from the request.
 * 
 * "4" = mpo, "5" = property.
 *
 * @param {Request} req - The incoming request object.
 * @returns {string|null} The user type code or `null` if missing.
 *
 * @example
 * // Header: ConnectedUserType: "5"
 * parseConnectedUserTypeHeader(req); // "5"
 */
export const parseConnectedUserTypeHeader = (req) => {
    const connectedUser = req.headers.get('ConnectedUserType');
    if (!connectedUser) {
        return null;
    }
    return connectedUser
};

/**
 * Resolves the gateway base URL from an environment name.
 *
 * "alpha" → IRALPHA; anything else (or missing) → `defaultUrl`.
 *
 * @param {string|null|undefined} environment - The environment name ("alpha" | "production").
 * @param {string} [defaultUrl] - The URL used outside of alpha.
 * @returns {string} The gateway base URL to use.
 */
export const resolveEnvironmentBaseUrl = (environment, defaultUrl = baseUrl) =>
    environment?.trim().toLowerCase() === 'alpha' ? alphaBaseUrl : defaultUrl;

/**
 * Resolves the gateway base URL from the 'Environment' header.
 *
 * "alpha" → IRALPHA; anything else (or missing) → `defaultUrl`.
 *
 * @param {Request} req - The incoming request object.
 * @param {string} [defaultUrl] - The URL used outside of alpha.
 * @returns {string} The gateway base URL to use for this request.
 */
export const getEnvironmentBaseUrl = (req, defaultUrl = baseUrl) =>
    resolveEnvironmentBaseUrl(req.headers.get('Environment'), defaultUrl);

/**
 * Verifies the existence and validity of an Authorization token in the request headers.
 *
 * This function reads the "authorization" header from the incoming request,
 * trims it, and returns the token string. It throws an error if the header
 * is missing, invalid, or empty.
 *
 * @param {Request} req - The incoming HTTP request object containing headers.
 * @throws {Error} If the "authorization" header is missing or the token is empty.
 * @returns {string} The extracted and validated authorization token.
 */
export const verifyToken = (req) => {
    const headers = new Headers(req.headers)
    const authHeader = headers.get("authorization");
    if (!authHeader) {
        throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.trim();
    if (!token) {
        throw new Error("Empty token");
    }
    return token;
}

/**
 * Reads the Authorization token when present, for routes where it's optional.
 *
 * @param {Request} req
 * @returns {string|null}
 */
export const getOptionalToken = (req) => {
    return req.headers.get("authorization")?.trim() || null;
}

/**
 * Retrieves detailed booking data, including property info, booking details,
 * localization entries, and related metadata.
 *
 * This function calls the printing service to fetch all booking-related data,
 * calculates totals (nights, persons), extracts guest and property contact info,
 * and returns a normalized object for downstream use (e.g., invoice or confirmation page).
 *
 * @async
 * @param {object} params - Parameters required by the printing service to identify the booking.
 * @param {string} token - The authorization token used for API calls.
 * @returns {Promise<{
*   i18n: ReturnType<typeof import("./labels").createLabels>,
*   totalPersons: number|null,
*   booking: object|null,
*   currency: string|null,
*   totalNights: number|null,
*   guestCountryName: string|null,
*   privateNote: object|null,
*   property: object|null,
*   penaltyStatement: object|null,
*   bookingEmail: string|null,
*   phone: string|null
* }>} A promise resolving to an object containing booking, property, and display data.
*/
export const getBookingData = async (params, token, headers = {}) => {
    const printingService = new PrintingService(token);
    if (Object.keys(headers).length > 0) {
        printingService.setDefaultHeaders(headers);
    }
    const [{ booking, property, countries, statement }, i18n] = await Promise.all([
        printingService.getPrintingData({ baseUrl, ...params }),
        fetchLabels(EMAIL_LABELS, params.language, { token, headers }),
    ]);
    if (!booking) {
        throw new Error("No booking found");
    }
    const totalPersons = booking?.occupancy?.adult_nbr + booking?.occupancy?.children_nbr;
    const currency = booking?.currency?.symbol;
    const totalNights = calculateDaysBetweenDates(booking.from_date, booking.to_date);
    const guestCountryName = printingService.getUserCountry(countries, booking.guest.country_id);
    const privateNote = booking.extras?.find((k) => k.key === "private_note");
    const bookingEmail = property?.contacts?.find((c) => c.type === "booking")?.email;
    const phone = formatPropertyPhone(property);
    return {
        i18n,
        totalPersons,
        booking,
        currency,
        totalNights,
        guestCountryName,
        privateNote,
        property,
        penaltyStatement: statement,
        bookingEmail,
        phone
    }
}

/**
 * Extract all search params from the request,
 * lower-cases each key (and value) for case-insensitive access.
 *
 * @param req  NextRequest instance
 * @param lowercaseValues  if true, also lower-cases the values
 */
export function extractSearchParamsInsensitive(
    req,
    lowercaseValues = true
) {
    const out = {};
    const { searchParams } = req.nextUrl;
    for (const [rawKey, rawVal] of searchParams.entries()) {
        const key = rawKey.toLowerCase();
        const val = lowercaseValues ? rawVal.toLowerCase() : rawVal;
        if (!val) {
            continue
        }
        out[key] = val;
    }
    return out;
}

/**
 * Returns the connected MPO for the request.
 * 
 * "5" → fetches property and returns `property.mpo`
 * "4" → fetches MPO directly
 *
 * @param {Request} req - The incoming request with headers.
 * @returns {Promise<{id:number,name:string,logo_url:string,bg_img_url:string}|null>} The MPO object or `null`.
 */
export async function getConnectedMpo(req, headers = {}) {
    const connectedUserType = parseConnectedUserTypeHeader(req);
    if (!connectedUserType) {
        return null
    }
    let mpo = null;
    const token = verifyToken(req);
    const commonService = new CommonServices(getEnvironmentBaseUrl(req));
    commonService.setToken(token);
    if (Object.keys(headers).length > 0) {
        commonService.setDefaultHeaders(headers);
    }
    switch (connectedUserType) {
        case "5":
            const property = await commonService.getExposedProperty();
            mpo = property.mpo
            break;
        case "4":
            mpo = await commonService.getExposedMpo()
            break;
        default:
            break;
    }
    return mpo
}
