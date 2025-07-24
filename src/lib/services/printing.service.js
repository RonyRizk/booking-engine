import { format, parse } from "date-fns";
import { CommonServices } from "./common.service";
import { Token } from "../token";
import { BookingService } from "./booking.service";


export class PrintingService extends Token {
    _bedPreferences = []
    constructor(token) {
        super();
        this.token = token
        this.baseUrl = "https://gateway.igloorooms.com/IR";
        this.commonService = new CommonServices(this.baseUrl);
        this.bookingService = new BookingService(this.baseUrl);
        this.commonService.setToken(token)
        this.bookingService.setToken(token)
    }

    async getPrintingData({ bookingNumber, aName, language = "en", baseUrl, tables, includePenaltyStatement }) {
        if (baseUrl) {
            this.commonService.setBaseUrl(baseUrl);
            this.bookingService.setBaseUrl(baseUrl)
        }
        const [booking, property, countries, locales, beddingPreference, statement] = await Promise.all([
            this.bookingService.getExposedBooking({ booking_nbr: bookingNumber, language }),
            this.commonService.getExposedProperty(aName, language),
            this.commonService.getCountries(language),
            this.commonService.fetchLanguage(language, tables ?? ["_PRINT_FRONT", "_PMS_FRONT"]),
            this.bookingService.getBedPreference(),
            includePenaltyStatement ? this.bookingService.getPenaltyStatement() : Promise.resolve(null)
        ])
        this._bedPreferences = beddingPreference
        return { booking, property, countries, locales, beddingPreference, statement, error: null }
    }

    //Helpers

    formatGuestName({ first_name, last_name }) {
        if (!last_name) {
            return first_name;
        }
        return `${first_name} ${last_name}`;
    }
    formatPhoneNumber({ mobile_without_prefix, country_phone_prefix }, is_direct) {
        // if (!is_direct) {
        //     return mobile;
        // }
        if (!country_phone_prefix) {
            return mobile_without_prefix;
        }
        return `+${country_phone_prefix?.replace('+', '')}-${mobile_without_prefix}`;
    }
    formatBookingDates(date) {
        const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
        return format(parsedDate, 'dd-MMM-yyyy');
    }
    getUserCountry(countries, country_id) {
        const country = countries.find(country => country.id === country_id);
        return country?.name;
    }
    formatDate(date) {
        const dayMonth = format(date, 'dd/MM');
        let dayOfWeekAbbr = format(date, 'EEE');
        if (['Thu', 'Sun', 'Sat'].includes(dayOfWeekAbbr)) {
            dayOfWeekAbbr = dayOfWeekAbbr.slice(0, 2);
        } else {
            dayOfWeekAbbr = dayOfWeekAbbr.charAt(0);
        }
        return `${dayMonth} ${dayOfWeekAbbr}`;
    }
    getBedLabel({ language, bed_preference }) {
        const bed = this._bedPreferences.find(p => p.CODE_NAME === bed_preference.toString());
        if (!bed) {
            throw new Error(`bed with code ${bed_preference} not found`);
        }
        return bed[`CODE_VALUE_${language}`] ?? bed.CODE_VALUE_EN;
    }

    formatGuestAvailability({ adult_nbr, children_nbr, infant_nbr }, locales) {
        // Adjust child number based on infants
        const adultCount = adult_nbr > 0 ? adult_nbr : 0;
        const childCount = children_nbr > 0 ? children_nbr : 0;
        const infantCount = infant_nbr > 0 ? infant_nbr : 0;

        // Define labels based on singular/plural rules
        const adultLabel = adultCount > 1 ? locales?.Lcz_Adults?.toLowerCase() ?? "adults" : locales?.Lcz_Adult?.toLowerCase() ?? "adult";
        const childLabel = childCount > 1 ? locales?.Lcz_Children?.toLowerCase() ?? "children" : locales.Lcz_Child?.toLowerCase() ?? "child";
        const infantLabel = infantCount > 1 ? locales?.Lcz_Infants?.toLowerCase() ?? "infants" : locales?.Lcz_Infant?.toLowerCase() ?? "infant";

        // Construct parts with the updated child number
        const parts = [];
        if (adultCount > 0) {
            parts.push(`${adultCount} ${adultLabel}`);
        }
        if (childCount > 0) {
            parts.push(`${childCount} ${childLabel}`);
        }
        if (infantCount > 0) {
            parts.push(`${infantCount} ${infantLabel}`);
        }
        return parts.join('&nbsp&nbsp&nbsp&nbsp');
    }

    calculateTotalPersons(booking) {
        const sumOfOccupancy = ({ adult_nbr, children_nbr, infant_nbr }) => {
            return (adult_nbr ?? 0) + (children_nbr ?? 0) + (infant_nbr ?? 0);
        };
        return booking.rooms.reduce((prev, cur) => {
            return sumOfOccupancy(cur.occupancy) + prev;
        }, 0);
    }
}
