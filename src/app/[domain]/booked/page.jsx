import InvoicePage from "../../../components/InvoicePage";
import { logger } from "../../../logger";
import { getExposedProperty } from "../../../lib/actions";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({ params, searchParams }) {
  const domain = decodeURIComponent(params.domain).split('.');
  const { e, s, lang, b } = searchParams;
  logger.info(`domain: ${domain}`)
  logger.info("Invoice Page called");
  let property;
  if (domain.length <= 2) {
    logger.info("Invoice:domain was less then 3 navigated to https://info.igloorooms.com");
    redirect("https://info.igloorooms.com")
  }
  try {
    property = await getExposedProperty({ perma_link: domain[0], aName: "" })
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
  if (!searchParams) {
    redirect(`https://${domain[0]}.bookingmystay.com`)
  }
  return (
    <InvoicePage
      perma_link={domain[0]}
      language={lang}
      email={e}
      bookingNbr={b}
      propertyId={42}
      status={s}
      headerMessageShown={true}
    />
  );
}
