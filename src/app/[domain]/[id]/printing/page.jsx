import React from "react";
import { redirect } from "next/navigation";
import { calculateDaysBetweenDates } from "@/lib/utils";
import { PrintingService } from "@/lib/services/printing.service";
import "./printing.css";
import PrintingHeader from "@/components/printing/PrintingHeader";
import GuestInformation from "@/components/printing/GuestInformation";
import AccommodationHeader from "@/components/printing/AccommodationHeader";
import RoomDetails from "@/components/printing/RoomDetails";
import PickupInformation from "@/components/printing/PickupInformation";
import PaymentInformation from "@/components/printing/PaymentInformation";
// import ChannelServices from "@/components/printing/ChannelServices";
import ExtraServices from "@/components/printing/ExtraServices";
/**
 * Printing page for booking confirmation/invoice documents.
 *
 * @param {Object} props
 * @param {Object} props.searchParams - URL search parameters controlling rendering behavior.
 * @param {("printing"|"invoice"|"receipt"|"proforma"|"creditnote")} [props.searchParams.mode="printing"]
 *   The output mode for the document:
 *   - `printing`: Standard print layout  
 *   - `invoice`: Invoice document  
 *   - `receipt`: Payment receipt  
 *   - `proforma`: Pro-forma invoice  
 *   - `creditnote`: Credit note
 * @param {string} props.searchParams.id - Booking number associated with the document.
 * @param {string} [props.searchParams.lang="en"] - Language code for localization.
 * @param {string} [props.searchParams.token] - Access token for secure printing API requests.
 *
 * @param {Object} props.params - Route parameters from Next.js dynamic segments.
 * @param {string} props.params.id - Property identifier from the URL.
 */
export default async function Printing({ searchParams, params }) {
  const { mode = "printing", id, lang = "en", token, pid, rnb } = searchParams;
  const printingService = new PrintingService(token);
  let data = {}
  try {
    data =
      await printingService.getPrintingData({
        bookingNumber: id,
        aName: params.id,
        language: lang,
      });
  } catch (error) {
    return redirect("https://x.igloorooms.com/manage/acbookinglist.aspx")
  }
  const { booking, property, setupTables, countries, locales: defaultLocales } = data
  const { entries: locales } = defaultLocales
  if (!booking) {
    return null;
  }
  if (mode === "receipt") {
    printingService.checkReceipt({ booking, receiptNumber: rnb, paymentId: pid })
  }

  const totalPersons = printingService.calculateTotalPersons(booking);
  const currency = booking?.currency.symbol;
  const totalNights = calculateDaysBetweenDates(booking.from_date, booking.to_date);
  const guestCountryName = printingService.getUserCountry(countries, booking.guest.country_id);
  const privateNote = booking.extras?.find((k) => k.key === "private_note");

  return (
    <>
      <PrintingHeader
        receiptNumber={rnb}
        guestCountryName={guestCountryName}
        totalPersons={totalPersons}
        printingService={printingService}
        privateNote={privateNote}
        booking={booking} property={property} locales={locales} mode={mode} />
      <main className="p-4 sm:px-6 lg:px-8 text-gray-800 py-0 text-sm max-w-4xl mx-auto" dir="ltr">
        <section>
          {mode !== "receipt" && <GuestInformation
            booking={booking}
            guestCountryName={guestCountryName}
            totalPersons={totalPersons}
            locales={locales}
            printingService={printingService}
            mode={mode}
            privateNote={privateNote}
          />}

          {mode !== "receipt" && <section className="pt-4">
            <AccommodationHeader
              locales={locales}
              booking={booking}
              totalNights={totalNights}
              property={property}
              printingService={printingService}
            />

            <div>
              {booking?.rooms?.map((room, idx) => (
                <RoomDetails
                  key={`room_${room.id}`}
                  room={room}
                  booking={booking}
                  property={property}
                  locales={locales}
                  currency={currency}
                  mode={mode}
                  printingService={printingService}
                  idx={idx}
                />
              ))}
            </div>
          </section>}
        </section>

        {/* {!booking?.is_direct && <ChannelServices booking={booking} locales={locales} />} */}
        {mode !== "receipt" && <>
          <PickupInformation booking={booking} locales={locales} />
          <ExtraServices booking={booking} locales={locales} />
        </>}
        <PaymentInformation paymentId={pid} setupTables={setupTables} mode={mode} booking={booking} locales={locales} />
      </main>
    </>
  );
}
