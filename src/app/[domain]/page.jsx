import React, { Suspense } from "react";
import BeTest from "../../components/BookingEngine"
import { getExposedProperty } from "@/utils/actions";
import { redirect } from "next/navigation";
import { logger } from "@/logger";


export default async function SiteHomePage({ params, searchParams }) {
  const domain = decodeURIComponent(params.domain).split('.');
  const { checkin, checkout, adults, children, rtid, stag, aff, cur, nights } =
    searchParams;
  logger.info(`domain: ${domain}`)
  logger.info("Main:Home Page called");
  let property;
  if (domain.length <= 2) {
    logger.info("Main:domain was less then 3 navigated to https://info.igloorooms.com");
    redirect("https://info.igloorooms.com")
  }
  try {
    property = await getExposedProperty(domain[0])
  } catch (error) {
    console.log(error)
    logger.error(error)
  }

  if (!property) {
    logger.info("Main:property was not found");
    redirect("/iglooroom?status=notfound")
  }
  if (!property?.is_be_enabled) {
    logger.info("Main:property not active");
    redirect("/iglooroom?status=notactive")
  }
  return (
    <BeTest
      nights={nights}
      propertyId={42}
      perma_link={domain[0]}
      cur={cur}
      aff={aff}
      stag={stag}
      roomtype_id={rtid}
      fromDate={checkin}
      toDate={checkout}
      adultCount={adults}
      childrenCount={children}
    />
  );
}
