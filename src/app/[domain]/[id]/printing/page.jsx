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

export default async function Printing({ searchParams, params }) {
  const { mode = "printing", id, lang = "en", token } = searchParams;
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

  const totalPersons = printingService.calculateTotalPersons(booking);
  const currency = booking?.currency.symbol;
  const totalNights = calculateDaysBetweenDates(booking.from_date, booking.to_date);
  const guestCountryName = printingService.getUserCountry(countries, booking.guest.country_id);
  const privateNote = booking.extras?.find((k) => k.key === "private_note");

  return (
    <>
      <PrintingHeader booking={booking} property={property} locales={locales} mode={mode} />
      <main className="p-4 sm:px-6 lg:px-8 text-gray-800 py-0 text-sm max-w-4xl mx-auto" dir="ltr">
        <section>
          <GuestInformation
            booking={booking}
            guestCountryName={guestCountryName}
            totalPersons={totalPersons}
            locales={locales}
            printingService={printingService}
            mode={mode}
            privateNote={privateNote}
          />

          <section className="pt-4">
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
          </section>
        </section>

        {/* {!booking?.is_direct && <ChannelServices booking={booking} locales={locales} />} */}
        <PickupInformation booking={booking} locales={locales} />
        <ExtraServices booking={booking} locales={locales} />
        <PaymentInformation setupTables={setupTables} mode={mode} booking={booking} locales={locales} />
      </main>
    </>
  );
}
