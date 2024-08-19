import InvoicePage from "@/components/InvoicePage";
import { logger } from "@/logger";
import { getExposedProperty } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({ params, searchParams }) {
    const { E, s, lang, BN } = searchParams;
    logger.info(`property: ${params.id}`)
    logger.info("Invoice Page called");
    let property;
    try {
        property = await getExposedProperty({ perma_link: "", aName: params.id })
    } catch (error) {
        console.log(error)
        logger.info(error)
    }
    if (!property) {
        logger.info("Invoice:property was not found");
        redirect("/iglooroom?status=notfound")
    }
    if (!property?.is_be_enabled) {
        logger.info("Invoice:property not active");
        redirect("/iglooroom?status=notactive")
    }
    return (
        <InvoicePage
            aName={params.id}
            locationShown={false}
            language={lang}
            email={E}
            bookingNbr={BN}
            propertyId={42}
            status={s}

        />
    );
}
