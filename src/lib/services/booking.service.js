import axios from "axios";
import { Token } from "../token";
export class BookingServiceError extends Error {
    constructor(method, params, originalError) {
        const message = `Error in ${method} with params ${JSON.stringify(params)}: ${originalError.message || originalError}`;
        super(message);
        this.name = 'BookingServiceError';
        this.method = method;
        this.params = params;
        this.originalError = originalError;
    }
}
export class BookingService extends Token {
    constructor(baseUrl) {
        super()
        this.baseUrl = baseUrl
    }
    setBaseUrl(url) {
        this.baseUrl = url
    }
    /**
     * Fetches the penalty statement for a specific booking.
     *
     * @async
     * @function getPenaltyStatement
     * @param {Object} props - The request payload.
     * @param {string} props.booking_nbr - The booking number to fetch the penalty statement for.
     * @param {number} props.currency_id - The ID of the currency used for the statement.
     * @param {string} props.language - The language code (e.g., "EN").
     * @returns {Promise<Object>} Resolves to the penalty statement result (`My_Result`).
     * @throws Will throw an error if the token is missing or if the API returns an exception message.
     *
     * @example
     * const service = new BookingService(baseUrl);
     * const penalty = await service.getPenaltyStatement({
     *   booking_nbr: "51683052688",
     *   currency_id: 4,
     *   language: "EN"
     * });
     */
    async getPenaltyStatement(props) {
        // const method = 'getPenaltyStatement';
        const token = this.getToken();
        if (!token) {
            throw new Error('Missing Token');
        }
        const { data } = await axios.post(`${this.baseUrl}/Get_Penalty_Statement`, props, {
            headers: {
                Authorization: token
            }
        });
        if (data.ExceptionMsg !== '') {
            throw new Error(data.ExceptionMsg);
        }
        return data.My_Result;
    }
    async getBedPreference() {
        const token = this.getToken();
        if (!token) {
            throw new Error('Missing Token');
        }
        const { data } = await axios.post(`${this.baseUrl}/Get_Setup_Entries_By_TBL_NAME`, {
            TBL_NAME: '_BED_PREFERENCE_TYPE',
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
    async getExposedBooking({ booking_nbr, language, withExtras = true }) {
        const token = this.getToken();
        if (!token) {
            throw new Error('Missing Token');
        }
        // if (booking_nbr === 83862713858)
        //     throw new Error("Invalid booking")
        const { data } = await axios.post(`${this.baseUrl}/Get_Exposed_Booking`, {
            booking_nbr,
            language,
            extras: withExtras ? [
                {
                    "key": "private_note",
                    "value": ""
                },
                {
                    "key": "is_backend",
                    "value": true
                },
                {
                    "key": "ERROR_EMAIL",
                    "value": ""
                },
                {
                    "key": "agent_payment_mode",
                    "value": ""
                },
                {
                    "key": "payment_code",
                    "value": ""
                }
            ] : null,
        }, {
            headers: {
                Authorization: token
            }
        });
        if (data.ExceptionMsg !== '') {
            throw new Error(JSON.stringify({ error: data.ExceptionMsg, token, booking_nbr }));
        }
        return data.My_Result;
    }
}
