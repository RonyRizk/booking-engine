import { Token } from "../token";
import { ApiService } from "./api.service";

export class BookingService extends Token {
    constructor(baseUrl) {
        super()
        this.apiService = new ApiService(baseUrl)
    }
    setToken(token) {
        this.token = token;
        this.apiService.setToken(token)
    }
    setBaseUrl(url) {
        this.apiService.setBaseUrl(url);
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
        const data = await this.apiService.makePostRequest(`/Get_Penalty_Statement`, props);
        return data.My_Result;
    }
    async getBedPreference() {
        const data = await this.apiService.makePostRequest(`/Get_Setup_Entries_By_TBL_NAME`, {
            TBL_NAME: '_BED_PREFERENCE_TYPE',
        });
        return data.My_Result;
    }

    /**
     * Fetches invoice information for a specific booking.
     *
     * @async
     * @function getBookingInvoiceInfo
     * @param {Object} props - The request payload.
     * @param {string} props.booking_nbr - The booking number to retrieve invoice info for.
     * @returns {Promise<Object>} Resolves to the booking invoice info (`My_Result`).
     * @throws Will throw an error if the token is missing or if the API returns an exception message.
     *
     * @example
     * const service = new BookingService(baseUrl);
     * const invoiceInfo = await service.getBookingInvoiceInfo({
     *   booking_nbr: "45436185167"
     * });
     */
    async getBookingInvoiceInfo(props) {
        const data = await this.apiService.makePostRequest(`/Get_Booking_Invoice_Info`, props);
        return data.My_Result;
    }
    async getExposedBooking({ booking_nbr, language, withExtras = true }) {
        const data = await this.apiService.makePostRequest(`/Get_Exposed_Booking`, {
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
        });
        return data.My_Result;
    }

    /**
        * Marks a payment as having its receipt issued.
        *
        * @async
        * @function markPaymentAsReceiptIssued
        * @param {Object} params - The request payload.
        * @param {string|number} params.payment_id - The ID of the payment to update.
        * @param {string} params.receipt_nbr - The receipt number that was issued.
        * @returns {Promise<Object>} Resolves to the API result (`My_Result`).
        * @throws Will throw an error if the token is missing or if the API responds with an exception message.
        *
        * @example
        * await bookingService.markPaymentAsReceiptIssued({
        *   payment_id: 12345,
        *   receipt_nbr: "RCPT-2025-009"
        * });
    */
    async markPaymentAsReceiptIssued(params) {
        const data = await this.apiService.makePostRequest(`/Mark_Payment_As_Receipt_Issued`, params);
        return data.My_Result;
    }
    async getPCICardInfoURL(BOOK_NBR) {
        const data = await this.apiService.makePostRequest(`/Get_PCI_Card_Info_URL`, {
            BOOK_NBR,
        });
        return data?.My_Result;
    }
}
