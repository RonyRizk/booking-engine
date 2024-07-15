import React from "react";
import BeTest from "../../../components/BookingEngine";

export default function Page({ searchParams, params }) {

  const {
    checkin,
    checkout,
    adults,
    children,
    stag,
    aff,
    cur,
    nights,
    lang,
    roomtype_id,
    rateplan_id,
    source
  } = searchParams;

  return (
    <BeTest
      nights={nights}
      propertyId={42}
      cur={cur}
      aff={aff}
      stag={stag}
      roomtype_id={roomtype_id}
      fromDate={checkin}
      toDate={checkout}
      adultCount={adults}
      childrenCount={children}
      language={lang}
      perma_link={undefined}
      aname={params.id}
      rateplan_id={rateplan_id}
      source={source}
    />
  );
}
