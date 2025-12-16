import React from "react";
import IrBookingEngine from "../../components/BookingEngine"
import { getExposedProperty } from "../../lib/actions";
import { redirect } from "next/navigation";
import { logger } from "../../logger";


export default async function SiteHomePage({ params, searchParams }) {
  const domain = decodeURIComponent(params.domain).split('.');
  const { checkin, checkout, adults, source, children, u, ages, stag, aff, cur, nights, lang, loyalty, promo, agent } =
    searchParams;
  logger.info(`domain: ${domain}`)
  logger.info("Main:Home Page called");
  let property;
  if (domain.length <= 2) {
    logger.info("Main:domain was less then 3 navigated to https://info.igloorooms.com");
    redirect("https://info.igloorooms.com")
  }
  try {
    property = await getExposedProperty({ perma_link: domain[0], aName: "" })
  } catch (error) {
    console.error(JSON.stringify(error))
    // logger.info(error)
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
    <IrBookingEngine
      nights={nights}
      propertyId={42}
      perma_link={domain[0]}
      cur={cur}
      aff={aff}
      stag={stag}
      roomtype_id={u}
      fromDate={checkin}
      toDate={checkout}
      adultCount={adults}
      childrenCount={children}
      language={lang}
      ages={ages}
      rateplan_id={undefined}
      source={source}
      coupon={promo}
      loyalty={loyalty}
      agent_code={agent}
    />
  );
}
