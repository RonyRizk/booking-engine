"use client";
export default function InvoicePage({
  language,
  propertyId,
  bookingNbr,
  email,
  status,
  perma_link,
  locationShown
}) {
  return (
    <ir-invoice
      location-shown={locationShown}
      perma_link={perma_link}
      language={language}
      base-url={"https://gateway.igloorooms.com/IRBE"}
      status={status}
      email={email}
      property-id={propertyId}
      booking-nbr={bookingNbr}
    ></ir-invoice>
  );
}
