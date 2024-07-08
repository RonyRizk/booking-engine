import React, { Suspense } from "react";
import BeTest from "../../components/BookingEngine"
import { getExposedProperty } from "@/utils/actions";
import { redirect } from "next/navigation";


export default async function SiteHomePage({ params, searchParams }) {
  const domain = decodeURIComponent(params.domain).split('.')[0];
  const { checkin, checkout, adults, children, rtid, stag, aff, cur, nights } =
    searchParams;
  const property = await getExposedProperty(domain)
  if (!property) {
    redirect("/iglooroom?status=notfound")
  }
  if (!property?.is_be_enabled) {
    redirect("/iglooroom?status=notactive")
  }
  return (
    <Suspense>
      <BeTest
        property={property}
        nights={nights}
        propertyId={42}
        perma_link={domain}
        cur={cur}
        aff={aff}
        stag={stag}
        roomtype_id={rtid}
        fromDate={checkin}
        toDate={checkout}
        adultCount={adults}
        childrenCount={children}
      />
    </Suspense>


  );
}
