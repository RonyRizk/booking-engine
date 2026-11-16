// import { logger } from "../../../logger";
import { getExposedProperty } from "../../../lib/actions";
import { redirect } from "next/navigation";
import { constructURL } from "../../../lib/utils";
import { errorLogger } from "@/logger";
import IrBookingEngine from "../../../components/BookingEngine";
import { isPropertySite, isTestingEnvironment, siteUrl } from "../../../lib/app-env";
import { bookingEngineProps } from "../../../lib/booking-engine-props";


export default async function Page({ searchParams, params }) {
  let perma_link = null;
  let property = null;
  try {
    property = await getExposedProperty({ perma_link: "", aName: params.id });
    if (property) {
      perma_link = property.perma_link;
    }
  } catch (error) {
    // console.log(error)
    // logger.info(error)
    errorLogger.log(error)
  }
  // A testing deployment has no permalink site of its own, so it shows the property here.
  if (property && isTestingEnvironment()) {
    if (!property.is_be_enabled) {
      redirect("/iglooroom?status=notactive")
    }
    return (
      <IrBookingEngine
        {...bookingEngineProps(searchParams)}
        propertyId={42}
        perma_link={property.perma_link}
        aname={params.id}
      />
    )
  }
  if (perma_link) {
    redirect(constructURL(siteUrl(perma_link), searchParams))
  }
  if (!property) {
    // logger.info("[id]:property was not found");
    if (isPropertySite(params.domain)) {
      return redirect(constructURL(`https://${params.domain}`, searchParams))
    } else {
      redirect("https://info.igloorooms.com/")
    }
  }
  return <div>

  </div>
  // return (
  //   <BeTest
  //     nights={nights}
  //     propertyId={42}
  //     cur={cur}
  //     aff={aff}
  //     stag={stag}
  //     roomtype_id={roomtype_id}
  //     fromDate={checkin}
  //     toDate={checkout}
  //     adultCount={adults}
  //     childrenCount={children}
  //     language={lang}
  //     perma_link={undefined}
  //     aname={params.id}
  //     rateplan_id={rateplan_id}
  //     source={source}
  //   />
  // );
}
