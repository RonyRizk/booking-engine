import axios from "axios";
import { Token } from "../token";

export class BookingService extends Token {
    constructor(baseUrl) {
        super()
        this.baseUrl = baseUrl
    }
    async getExposedBooking({ booking_nbr, language, withExtras = true }) {
        const token = this.getToken();
        if (!token) {
            throw new Error('Missing Token');
        }
        const { data } = await axios.post(`${this.baseUrl}/Get_Exposed_Booking`, {
            booking_nbr,
            language,
            extras: withExtras ? [
                {
                    key: 'private_note',
                    value: '',
                },
                {
                    key: 'is_backend',
                    value: true,
                },
            ] : null,
        }, {
            headers: {
                Authorization: token
            }
        });
        if (data.ExceptionMsg !== '') {
            throw new Error(data.ExceptionMsg);
        }
        return data.My_Result;
    }
}