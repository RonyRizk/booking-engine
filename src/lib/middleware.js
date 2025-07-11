import { CommonServices } from "./services/common.service";
import { PrintingService } from "./services/printing.service";
import { calculateDaysBetweenDates } from "./utils";

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
const baseUrl = "https://gateway.igloorooms.com/IRBE";
const sections = ["_FRONT"]

export const getSystemData = async (
    { aName, language = "en", withProperty = true },
    token
) => {
    const commonService = new CommonServices(baseUrl);
    commonService.setToken(token);
    let property = null;
    let locales = null;
    if (withProperty) {
        [property, locales] = await Promise.all([
            commonService.getExposedProperty(aName, language),
            commonService.fetchLanguage(language, sections),
        ]);
    } else {
        property = null;
        locales = await commonService.fetchLanguage(language, sections);
    }
    return { property, locales };
}

export const getBookingData = async (params, token) => {
    const printingService = new PrintingService(token);
    const { booking, property, countries, locales: defaultLocales, statement, error } =
        await printingService.getPrintingData({ ...params, baseUrl, tables: sections });
    const { entries: locales } = defaultLocales
    const totalPersons = booking?.occupancy?.adult_nbr + booking?.occupancy?.children_nbr;
    const currency = booking?.currency?.symbol;
    const totalNights = calculateDaysBetweenDates(booking.from_date, booking.to_date);
    const guestCountryName = printingService.getUserCountry(countries, booking.guest.country_id);
    const privateNote = booking.extras?.find((k) => k.key === "private_note");
    const bookingEmail = property?.contacts?.find((c) => c.type === "booking")?.email;
    const phone = `+${property?.country?.phone_prefix?.replace("+", "") || ""}-${property?.phone || ""}`;
    return {
        locales,
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
