import clsx from "clsx";
import { differenceInDays, format, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

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
export function formatAmount(amount, currency = 'USD', withIntl = false) {
    if (withIntl) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
    }
    return `${currency}${amount?.toFixed(2)}`;
}
export function calculateDaysBetweenDates(from_date, to_date) {
    const startDate = parse(from_date, 'yyyy-MM-dd', new Date());
    const endDate = parse(to_date, 'yyyy-MM-dd', new Date());
    const daysDiff = differenceInDays(endDate, startDate);
    return daysDiff || 1;
}

export function extractAndRemoveScriptTags(htmlContent) {
    // This regex matches <script> tags and captures their contents
    const scriptTagRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

    // This array will store the contents of all script tags
    let scriptContents = [];

    // Extract script contents and store them in the array
    htmlContent.replace(scriptTagRegex, (match) => {
        const content = match.replace(/<\/?script\b[^>]*>/gi, ''); // Remove the opening and closing script tags
        scriptContents.push(content.trim());
        return '';
    });

    // Remove all script tags from the original content
    const cleanContent = htmlContent.replace(scriptTagRegex, '');

    // Return the cleaned content and the array of script contents
    return scriptContents?.join(' ') ?? "";
}

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
