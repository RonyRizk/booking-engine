"use client";
import { useRef } from "react";

export default function IrBookingListing({
    propertyId,
    perma_link,
    aff,
    language,
    aname,
}) {
    const bookingListingRef = useRef(null);
    return (
        <>
            <ir-booking-listing
                ref={bookingListingRef}
                language={language}
                propertyid={propertyId || 42}
                aff={aff}
                a-name={aname}
                perma_link={perma_link}
                base-url={"https://gateway.igloorooms.com/IRBE"}
                version={"2.5"}
            ></ir-booking-listing>
        </>
    );
}
