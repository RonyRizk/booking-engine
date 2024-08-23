import axios from "axios";
import { format, parse } from "date-fns";
import { CommonServices } from "./common.service";
import { Token } from "../token";
import { BookingService } from "./booking.service";

export class PrintingService extends Token {
    constructor() {
        super();
        this.baseUrl = "https://gateway.igloorooms.com/IR"
        this.commonService = new CommonServices(this.baseUrl);
        this.bookingService = new BookingService(this.baseUrl);
    }

    async getPrintingToken(aName) {
        if (this.token) {
            return;
        }
        try {
            const { data } = await axios.post(`${this.baseUrl}/Get_IP_Restricted_Token`,
                {
                    aname: aName
                }
            );
            const token = data.My_Result
            this.setToken(token);
            this.commonService.setToken(token)
            this.bookingService.setToken(token)

        } catch (error) {
            console.error("Failed to get printing token:", error)
            throw error;
        }
    }
    async getPrintingData({ bookingNumber, aName, language = "en" }) {
        const [booking, property, countries, locales] = await Promise.all([
            this.bookingService.getExposedBooking({ booking_nbr: bookingNumber, language }),
            this.commonService.getExposedProperty(aName, language),
            this.commonService.getCountries(language),
            this.commonService.fetchLanguage(language)
        ])
        return { booking, property, countries, locales }
    }

    //Helpers

    formatGuestName({ first_name, last_name }) {
        if (!last_name) {
            return first_name;
        }
        return `${first_name} ${last_name}`;
    }
    formatPhoneNumber({ mobile, country_phone_prefix }, is_direct) {
        if (!is_direct) {
            return mobile;
        }
        if (!country_phone_prefix) {
            return mobile;
        }
        return `+${country_phone_prefix.replace('+', '')}-${mobile}`;
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
}