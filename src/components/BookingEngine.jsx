"use client";
import React from "react";
// import _ from "iglooroom/dist/iglooroom/iglooroom.esm";
import { addDays } from "date-fns";
import Script from "next/script";
export default function BeTest({
  propertyId,
  perma_link,
  fromDate,
  toDate,
  adultCount,
  childrenCount,
  cur,
  aff,
  stag,
  roomtype_id,
  nights,
}) {
  if (nights) {
    toDate = addDays(new Date(fromDate), nights);
  }
  return (
    <>
      <ir-booking-engine
        property-id={propertyId || 42}
        cur={cur}
        aff={aff}
        stag={stag}
        roomtype_id={roomtype_id}
        perma_link={perma_link}
        base-url="https://gateway.igloorooms.com/IRBE"
        from-date={fromDate}
        to-date={toDate}
        adult-count={adultCount}
        children-count={childrenCount}
      ></ir-booking-engine>
    </>
  );
}
