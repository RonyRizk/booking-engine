import axios from "axios";

export async function getExposedProperty(domain) {
    const { data: tokenData } = await axios.post(
        `${process.env.IGLOO_BASE_URL}/Get_BE_Token`,
        {}
    );
    const token = tokenData.My_Result;
    const { data } = await axios.post(
        `${process.env.IGLOO_BASE_URL}/Get_Exposed_Property?Ticket=${token}`,
        {
            id: -1,
            language: "EN",
            perma_link: domain,
        }
    );
    return data.My_Result;
}