import { getExposedProperty } from "@/lib/actions";
import { redirect } from "next/navigation";
import { logger } from "@/logger";
import IrBookingListing from "@/components/BookingListing";


export default async function SiteHomePage({ params, searchParams }) {
    const aname = params.id
    const { aff, lang } =
        searchParams;
    logger.info(`aname: ${aname}`)
    logger.info("Bookings:Home Page called");
    let property;
    try {
        property = await getExposedProperty({ perma_link: "", aName: aname })
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
                aname={aname}
                aff={aff}
                language={lang}
            />
        </>

    );
}
