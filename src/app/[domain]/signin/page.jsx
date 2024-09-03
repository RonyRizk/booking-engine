import { getExposedProperty } from "@/lib/actions";
import { redirect } from "next/navigation";
import { logger } from "@/logger";
import IrBookingListing from "@/components/BookingListing";


export default async function SiteHomePage({ params, searchParams }) {
    const domain = decodeURIComponent(params.domain).split('.');
    const { aff, lang } =
        searchParams;
    logger.info(`domain: ${domain}`)
    logger.info("Bookings:Home Page called");
    let property;
    if (domain.length <= 2) {
        logger.info("Bookings:domain was less then 3 navigated to https://info.igloorooms.com");
        redirect("https://info.igloorooms.com")
    }
    try {
        property = await getExposedProperty({ perma_link: domain[0], aName: "" })
    } catch (error) {
        console.error(JSON.stringify(error))
        // logger.info(error)
    }

    if (!property) {
        logger.info("Bookings:property was not found");
        redirect("/iglooroom?status=notfound")
    }
    if (!property?.is_be_enabled) {
        logger.info("Bookings:property not active");
        redirect("/iglooroom?status=notactive")
    }
    return (
        <>
            <IrBookingListing
                propertyId={42}
                perma_link={domain[0]}
                aff={aff}
                language={lang}
            />
        </>

    );
}
