import axios from "axios";

export async function getExposedProperty(domain) {

    if (!domain) {
        return null;
    }
    const { data: tokenData } = await axios.post(
        `https://gateway.igloorooms.com/IRBE/Get_BE_Token`,
        {}
    );
    const token = tokenData.My_Result;

    const { data } = await axios.post(
        `https://gateway.igloorooms.com/IRBE/Get_Exposed_Property?Ticket=${token}`,
        {
            id: 1,
            language: "EN",
            perma_link: domain,
        }
    );

    return data.My_Result;
}