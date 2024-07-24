"use client";
import { addDays } from "date-fns";
import { useEffect, useRef } from "react";

export default function IrBookingEngine({
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
  language,
  aname,
  rateplan_id,
  source
}) {
  if (nights) {
    toDate = addDays(new Date(fromDate), nights);
  }
  const bookingEngineRef = useRef(null);
  useEffect(() => {
    if (bookingEngineRef.current && source) {
      bookingEngineRef.current.source = { code: source, description: "" };
    }
  }, [source]);

  return (
    <>
      <ir-booking-engine
        ref={bookingEngineRef}
        language={language}
        property-id={propertyId || 42}
        cur={cur}
        aff={aff}
        stag={stag}
        a-name={aname}
        roomtype_id={roomtype_id}
        perma_link={perma_link}
        base-url={"https://gateway.igloorooms.com/IRBE"}
        from-date={fromDate}
        to-date={toDate}
        adult-count={adultCount}
        children-count={childrenCount}
        rateplan_id={rateplan_id}
        version={"2.5"}
      ></ir-booking-engine>
    </>
  );
}
