import axios from "axios";

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
        const token = await fetchToken();
        const { data } = await axios.post(
            `https://gateway.igloorooms.com/IRBE/Get_Exposed_Property`,
            {
                id: 1,
                language: "EN",
                perma_link,
                aname: aName
            },
            {
                headers: {
                    Authorization: token,
                    'X-ClientId': "BE"
                },

            }
        );

        return data.My_Result;
    } catch (error) {

        throw error;
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
        const { data: tokenData } = await axios.post(
            `https://gateway.igloorooms.com/IRBE/Get_BE_Token`,
            {},
            {
                headers: {
                    'X-ClientId': "BE"
                },

            }
        );
        return tokenData.My_Result;
    } catch (error) {

        throw error;
    }
}
