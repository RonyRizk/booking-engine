import React from "react";
import BookingEngine from "@/components/BookingEngine";

// export async function generateStaticParams() {

//     const allPaths = allSites
//       .flatMap(({ subdomain, customDomain }) => [
//         subdomain && {
//           domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
//         },
//         customDomain && {
//           domain: customDomain,
//         },
//       ])
//       .filter(Boolean);

//     return allPaths;
//   }
export default function SiteHomePage({ params, searchParams }) {
  const domain = decodeURIComponent(params.domain).split('.')[0];
  const { checkin, checkout, adults, children, rtid, stag, aff, cur, nights } =
    searchParams;
  return (
    <BookingEngine
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
  );
}
