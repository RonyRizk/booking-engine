import { logger } from "@/logger";
import { getExposedProperty } from "@/lib/actions";
import { redirect } from "next/navigation";
import { constructURL } from "@/lib/utils";


export default async function Page({ searchParams, params }) {
  let perma_link = null;
  let property = null;
  const isBookingMyStayDomain = (url) => {
    const regex = /^([a-zA-Z0-9-]+)\.bookingmystay\.com$/;
    return regex.test(url);
  }
  try {
    property = await getExposedProperty({ perma_link: "", aName: params.id });
    if (property) {
      perma_link = property.perma_link;
    }
  } catch (error) {
    console.log(error)
    logger.info(error)
  }
  if (perma_link) {
    redirect(constructURL(`https://${perma_link}.bookingmystay.com`, searchParams))
  }
  if (!property) {
    logger.info("[id]:property was not found");
    if (isBookingMyStayDomain(params.domain)) {
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
