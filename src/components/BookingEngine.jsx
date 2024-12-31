"use client";
import { addDays } from "date-fns";
import { useEffect, useRef } from "react";

export default function IrBookingEngine({
  propertyId,
  perma_link,
  fromDate,
  ages,
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
  source,
  coupon,
  loyalty,
  agent_code
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
      <ir-be
        ages={ages}
        origin="be"
        ref={bookingEngineRef}
        language={language}
        property-id={propertyId || 42}
        cur={cur}
        aff={aff}
        stag={stag}
        p={aname}
        rt_id={roomtype_id}
        perma_link={perma_link}
        checkin={fromDate}
        checkout={toDate}
        adults={adultCount}
        child={childrenCount}
        rp_id={rateplan_id}
        version={"2.6"}
        coupon={coupon}
        loyalty={loyalty}
        agent_code={agent_code}
      ></ir-be>
    </>
  );
}
