import { differenceInDays, format, parse } from "date-fns";

/**
 * Constructs a URL by appending query parameters to a given base URL.
 *
 * @param {string} baseUrl - The base URL to which the query parameters will be appended.
 * @param {object} paramsObj - An object containing key-value pairs representing the query parameters.
 * @returns {string} - The constructed URL with the query parameters appended. 
 *                     If paramsObj is empty, the function returns the baseUrl unchanged.
 *
 * @example
 * const baseUrl = 'https://example.com/api';
 * const params = { search: 'query', page: 2 };
 * const fullUrl = constructURL(baseUrl, params);
 * console.log(fullUrl); 
 * // Output: "https://example.com/api?search=query&page=2"
 */
export function constructURL(baseUrl, paramsObj) {
    let url = baseUrl.endsWith('?') ? baseUrl : (baseUrl + '?');
    for (let key in paramsObj) {
        if (paramsObj.hasOwnProperty(key)) {
            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(paramsObj[key]);
            url += `${encodedKey}=${encodedValue}&`;
        }
    }
    return url.length > baseUrl.length ? url.slice(0, -1) : baseUrl;
}
export function formatTime(hour, minute) {
    const timeString = `${hour}:${minute}`;
    const parsedTime = parse(timeString, 'HH:mm', new Date());
    return format(parsedTime, 'hh:mm a');
}
export function formatAmount(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
}
export function calculateDaysBetweenDates(from_date, to_date) {
    const startDate = parse(from_date, 'yyyy-MM-dd', new Date());
    const endDate = parse(to_date, 'yyyy-MM-dd', new Date());
    const daysDiff = differenceInDays(endDate, startDate);
    return daysDiff || 1;
}