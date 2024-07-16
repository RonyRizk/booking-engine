import axios from "axios";
import { jwtDecode } from "jwt-decode";

let anchor = {
    token: null
};

/**
 * Retrieves exposed property information using the provided parameters.
 *
 * @param {object} params - The parameters for the request.
 * @param {string} params.aName - The name of the property.
 * @param {string} params.perma_link - The permalink of the property.
 * @returns {object} - The result of the API call containing the exposed property information.
 * @throws {Error} - Throws an error if the request fails.
 *
 * @example
 * const propertyInfo = await getExposedProperty({ aName: 'PropertyName', perma_link: 'property-link' });
 * console.log(propertyInfo);
 */
export async function getExposedProperty({ aName, perma_link }) {
    try {
        await ensureTokenIsValid();
        const { data } = await axios.post(
            `https://gateway.igloorooms.com/IRBE/Get_Exposed_Property?Ticket=${anchor.token}`,
            {
                id: 1,
                language: "EN",
                perma_link,
                aname: aName
            }
        );

        return data.My_Result;
    } catch (error) {
        console.error('Error in getExposedProperty:', error);
        throw error;
    }
}

/**
 * Ensures that the token is valid and not expired. If expired or not present, it fetches a new token.
 *
 * @returns {Promise<void>}
 * @throws {Error} - Throws an error if fetching a new token fails.
 *
 * @example
 * await ensureTokenIsValid();
 */
async function ensureTokenIsValid() {
    if (!anchor.token || isTokenExpired(anchor.token)) {
        const newToken = await fetchToken();
        anchor.token = newToken;
    }
}

/**
 * Fetches a new token from the API.
 *
 * @returns {Promise<string>} - The new token.
 * @throws {Error} - Throws an error if the request fails.
 *
 * @example
 * const token = await fetchToken();
 * console.log(token);
 */
async function fetchToken() {
    try {
        console.log("fetching token");
        const { data: tokenData } = await axios.post(
            `https://gateway.igloorooms.com/IRBE/Get_BE_Token`,
            {}
        );
        return tokenData.My_Result;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
}

/**
 * Checks if the provided token is expired.
 *
 * @param {string} token - The token to check.
 * @returns {boolean} - Returns true if the token is expired, false otherwise.
 *
 * @example
 * const isExpired = isTokenExpired('your-jwt-token');
 * console.log(isExpired); // Output: true or false
 */
function isTokenExpired(token) {
    const decoded = jwtDecode(token);
    return Math.floor(Date.now() / 1000) >= decoded.exp;
}
