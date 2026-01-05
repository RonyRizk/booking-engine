import { errorLogger } from "../../../../logger";
import { getExposedProperty } from "../../../../lib/actions";
import { redirect } from "next/navigation";


export default async function page({ params, searchParams }) {
    const { BN } = searchParams;
    // logger.info(`property: ${params.id}`)
    // logger.info("Invoice Page called");
    let property;
    try {
        property = await getExposedProperty({ perma_link: "", aName: params.id })
    } catch (error) {
        // console.log(error)
        errorLogger.log(error)
    }
    if (!property) {
        // logger.info("Invoice:property was not found");
        redirect("/iglooroom?status=notfound")
    }
    if (!property?.is_be_enabled) {
        // logger.info("Invoice:property not active");
        redirect("/iglooroom?status=notactive")
    }
    redirect(`https://www.igloorooms.com/booking-details.html?BN=${BN}&pid=${property.id}`)
}
