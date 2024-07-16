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