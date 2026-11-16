import React from "react";
import IrBookingEngine from "../../components/BookingEngine"
import { getExposedProperty } from "../../lib/actions";
import { bookingEngineProps } from "../../lib/booking-engine-props";
import { redirect } from "next/navigation";
import { errorLogger } from "../../logger";


export default async function SiteHomePage({ params, searchParams }) {
  const domain = decodeURIComponent(params.domain).split('.');
  // logger.info(`domain: ${domain}`)
  // logger.info("Main:Home Page called");
  let property;
  if (domain.length <= 2) {
    // logger.info("Main:domain was less then 3 navigated to https://info.igloorooms.com");
    redirect("https://info.igloorooms.com")
  }
  try {
    property = await getExposedProperty({ perma_link: domain[0], aName: "" })
  } catch (error) {
    // console.error(JSON.stringify(error))
    errorLogger.log(JSON.stringify(error))
    // logger.info(error)
  }

  if (!property) {
    // logger.info("Main:property was not found");
    redirect("/iglooroom?status=notfound")
  }
  if (!property?.is_be_enabled) {
    // logger.info("Main:property not active");
    redirect("/iglooroom?status=notactive")
  }
  return (
    <IrBookingEngine
      {...bookingEngineProps(searchParams)}
      propertyId={42}
      perma_link={domain[0]}
      rateplan_id={undefined}
    />
  );
}
