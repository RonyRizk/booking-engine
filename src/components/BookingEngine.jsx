"use client";
import React, { useEffect, useRef } from "react";
import { addDays } from "date-fns";

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
  property
}) {
  if (nights) {
    toDate = addDays(new Date(fromDate), nights);
  }
  const be = useRef(null);

  useEffect(() => {
    if (be.current) {
      be.current.perma_link = perma_link;
      be.current.property = property;
    }
  }, [perma_link, property]);

  return (
    <>
      <ir-booking-engine
        ref={be}
        property={property}
        property-id={propertyId || 42}
        cur={cur}
        aff={aff}
        stag={stag}
        roomtype_id={roomtype_id}
        perma_link={perma_link}
        base-url={process.env.IGLOO_BASE_URL}
        from-date={fromDate}
        to-date={toDate}
        adult-count={adultCount}
        children-count={childrenCount}
      ></ir-booking-engine>
    </>
  );
}
