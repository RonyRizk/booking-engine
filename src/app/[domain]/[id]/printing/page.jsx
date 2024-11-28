/* eslint-disable @next/next/no-img-element */
import { PrintingService } from "@/lib/services/printing.service";
import { format, parse } from "date-fns";
import React from "react";
import "./printing.css";
import {
  calculateDaysBetweenDates,
  formatAmount,
  formatTime,
} from "@/lib/utils";
import { redirect } from "next/navigation";



const InfoDisplay = ({ label, value, className }) => {
  return (
    <div className={`flex items-start gap-1 ${className}`}>
      {label && <p className="font-bold text-gray-900">{label}</p>}
      <p className="">{value}</p>
    </div>
  );
};
export default async function Printing({ searchParams, params }) {
  const { mode = "printing", id, lang = "en", token } = searchParams;
  const printingService = new PrintingService(token);
  const { booking, isError, property, countries, locales: defaultLocales } =
    await printingService.getPrintingData({
      bookingNumber: id,
      aName: params.id,
      language: lang,
    });

  if (isError) {
    return redirect("https://x.igloorooms.com/manage/acbookinglist.aspx")
  }
  const { entries: locales } = defaultLocales
  if (!booking) {
    return null;
  }
  const PrintingHeader = () => {
    return (
      <header className=" px-4 pt-4 sm:px-6 lg:px-8 text-gray-800  py-0 text-sm max-w-4xl mx-auto">
        <nav className="flex flex-col-reverse md:flex-row md:justify-between md:w-full">
          <div>
            <img
              src={property.space_theme.logo}
              alt="logo"
              className="aspect-1 h-14 hidden mb-2.5 md:block"
            />
            <InfoDisplay
              label={`${locales?.Lcz_Address}:`}
              value={[
                property?.address ?? null,
                property?.city.name ?? null,
                property?.country.name ?? null,
              ]
                .filter((f) => f !== null)
                .join(", ")}
            />
            <InfoDisplay
              label={`${locales?.Lcz_Phone}:`}
              value={`+${property?.country?.phone_prefix.replace("+", "") + " -" || ""
                } ${property?.phone}`}
            />
          </div>
          <div>
            <p className="text-xl text-gray-900">{locales?.Lcz_Booking}#{booking?.is_direct ? booking?.booking_nbr : booking?.booking_nbr}</p>
            {!booking.is_direct && <p className="md:text-end text-xl">{booking.channel_booking_nbr}</p>}
            <div className={"flex items-center md:justify-end"}>
              <p className="booked_on_date">
                {format(
                  parse(booking?.booked_on.date, "yyyy-MM-dd", new Date()),
                  "dd-MMM-yyyy"
                )}{" "}
                {formatTime(
                  booking?.booked_on.hour.toString(),
                  booking?.booked_on.minute.toString()
                )}
              </p>
              <img
                src={booking?.origin.Icon}
                alt={booking?.origin.Label}
                className="size-6 aspect-1 ml-2"
              />
            </div>
            {mode === "invoice" && property?.tax_nbr && (
              <div className="flex md:justify-end">
                <InfoDisplay label={`${locales?.Lcz_TaxID}:`} value={property?.tax_nbr} />
              </div>
            )}
          </div>
        </nav>
        <section className="pb-4">
          {<div className="flex items-center  w-full justify-between flex-wrap">
            <p className="property_name">{property?.name}</p>
            {mode === "invoice" && <div>
              <InfoDisplay
                label={`${locales?.Lcz_InvoiceReference}:`}
                value={booking?.financial.invoice_nbr}
              />
            </div>}
          </div>}
        </section>
      </header>
    );
  };
  const TaxAmount = ({ room }) => {
    if (!booking?.is_direct) {
      const filtered_data = room.ota_taxes.filter((tx) => tx.amount > 0);
      return filtered_data.map((d, index) => {
        return (
          <div key={`room_${d.name}_${index}`} className="flex items-center gap-1 text-xs">
            <p className="label-title">
              {d.is_exlusive ? locales?.Lcz_Excluding : locales?.Lcz_Including} {d.name}
            </p>
            <p>
              {d.currency.symbol}
              {d.amount}
            </p>
          </div>
        );
      });
    }
    const filtered_data = property?.taxes?.filter((tx) => tx.pct > 0);
    return filtered_data?.map((d, index) => {
      const amount = (room.total * d.pct) / 100;
      return (
        <div key={`direct_room_${d.name}_${index}`} className="flex items-center gap-1 text-xs">
          <p className="label-title">
            {d.is_exlusive ? locales?.Lcz_Excluding : locales?.Lcz_Including} {d.name}
          </p>
          <p>
            {d.pct}%: {formatAmount(amount, currency)}
          </p>
        </div>
      );
    });
  };
  //48157715406
  const totalPersons =
    booking?.occupancy.adult_nbr + booking?.occupancy.children_nbr;
  const currency = booking?.currency.symbol;
  const totalNights = calculateDaysBetweenDates(
    booking.from_date,
    booking.to_date
  );
  const guestCountryName = printingService.getUserCountry(
    countries,
    booking.guest.country_id
  );
  const privateNote = booking.extras?.find((k) => k.key === "private_note");
  return (
    <>
      <PrintingHeader />
      <main className="p-4 sm:px-6 lg:px-8 text-gray-800  py-0 text-sm max-w-4xl mx-auto" dir="ltr">
        <section>
          <section className="py-4 border-y border-gray-300 justify-start flex">
            <div className="flex-1">
              <InfoDisplay
                label={`${locales?.Lcz_BookedBy}:`}
                value={`${printingService.formatGuestName(
                  booking?.guest
                )} - ${totalPersons} ${totalPersons > 1 ? locales?.Lcz_Persons : locales?.Lcz_Person}`}
              />
              <InfoDisplay
                label={`${locales?.Lcz_Phone}:`}
                value={printingService.formatPhoneNumber(
                  booking?.guest,
                  booking?.is_direct
                )}
              />
              <InfoDisplay label={`${locales?.Lcz_Email}:`} value={booking?.guest?.email} />
              {guestCountryName && (
                <InfoDisplay label={`${locales?.Lcz_Country}:`} value={guestCountryName} />
              )}
              <InfoDisplay
                label={`${locales?.Lcz_ArrivalTime}:`}
                value={booking?.arrival?.description}
              />
              {booking.remark && booking.is_direct && <InfoDisplay label={`${locales?.Lcz_Notes ?? "Notes"}:`} value={booking.remark} />}
              {booking.ota_notes && !booking.is_direct && <div className="flex items-start gap-1 flex-grow">
                <p className="font-medium text-gray-900">{locales?.Lcz_Notes ?? "Notes"}:</p>
                <div>
                  {booking.ota_notes?.map((notes) => (<p key={`ota_note_${notes.statement}`} className="text-gray-600">
                    {notes.statement}
                  </p>))}
                </div>
              </div>}
              {privateNote && <InfoDisplay label={`${locales?.Lcz_PrivateNote}:`} value={privateNote.value} />}
            </div>
            <p className="text-gray-900 text-lg font-semibold">
              {booking.status.description}
            </p>
          </section>
          <section className="pt-4">
            <div className="flex items-center justify-between flex-wrap mb-4">
              <p className="text-lg font-semibold text-gray-900">{locales?.Lcz_ACCOMMODATION}</p>
              <p className="booking-dates">
                {printingService.formatBookingDates(booking?.from_date)}
              </p>
              <p className="booking-dates">
                {printingService.formatBookingDates(booking?.to_date)}
              </p>
              <p className="number-of-nights">
                {totalNights} {totalNights === 1 ? locales?.Lcz_night : locales?.Lcz_nights}
              </p>
              <p className="vat-exclusion">
                <i>{property?.tax_statement}</i>
              </p>
            </div>
            <div>
              {booking?.rooms?.map((room, idx) => (
                <section key={room.id} >
                  <div className="flex items-center gap-2.5 font-bold text-base mb-1.5">
                    <p>{room.roomtype.name}</p>
                    <p>{room.rateplan.short_name || room.rateplan.name}</p>
                  </div>
                  <div className="flex gap-2.5 flex-col md:flex-row md:justify-between mb-2.5 md:gap-10 md:flex-wrap">

                    <div className="flex-1">
                      <InfoDisplay
                        label={`${locales?.Lcz_GuestName}:`}
                        value={printingService.formatGuestName(room?.guest)}
                      />
                      <InfoDisplay
                        label={``}

                        value={printingService.formatGuestAvailability(room?.rateplan.selected_variation, room.occupancy, locales)}
                      />

                      {booking.is_direct && <>
                        <p
                          className=""
                          dangerouslySetInnerHTML={{
                            __html: room.rateplan.cancelation.replace("<u>", "").replace("</u>", "").replace('<b>', '<b style="font-weight:bold">'),
                          }}
                        ></p>
                        <p
                          className=""
                          dangerouslySetInnerHTML={{
                            __html: room.rateplan.guarantee.replace("<u>", "").replace("</u>", "").replace('<b>', '<b style="font-weight:bold">'),
                          }}
                        ></p>
                      </>}
                    </div>
                    <div className=" text-end flex flex-col md:items-end">
                      <InfoDisplay
                        label={`${locales?.Lcz_Total}:`}
                        value={formatAmount(room.total, currency)}
                      />
                      <TaxAmount room={room} />
                      <div>
                        <InfoDisplay
                          label={`${locales?.Lcz_GrandTotal}:`}
                          value={formatAmount(room.gross_total, currency)}
                        />
                      </div>
                      {booking.is_direct && <InfoDisplay
                        label={`${locales?.Lcz_DueUponBooking}:`}
                        value={formatAmount(Number(room.gross_guarantee), currency)}
                      />}
                    </div>
                  </div>


                  {/* Rendering room dates */}
                  <div
                    className={`flex flex-wrap ${idx < booking?.rooms.length - 1 ? "pb-4 " : ""
                      }`}
                  >
                    {room.days?.map((d) => (
                      <div className={"room_amount_container"} key={d.date}>
                        <p className="room_amount date">
                          {printingService.formatDate(d.date, "YYYY-MM-DD")}
                        </p>
                        <div className="room_amount amount pr-1.5">
                          <p> {formatAmount(d.amount, currency)}</p>
                          {/* {<p className="text-center"> -15%</p>} */}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        </section>
        {booking.pickup_info && (
          <section className="py-4 border-gray-300 border-y">
            <p className="text-lg font-semibold text-gray-900 mb-2.5">
              {locales?.Lcz_PickupYes.replace("%1", booking.pickup_info.selected_option.location.description)}
            </p>
            <div>
              <div className="flex items-center gap-1.5 md:gap-4 flex-wrap ">
                <InfoDisplay
                  label={`${locales?.Lcz_ArrivalDate}:`}
                  value={format(
                    new Date(booking?.pickup_info.date),
                    "eeee, dd MMM yyyy"
                  )}
                />
                <InfoDisplay
                  label={`${locales?.Lcz_ArrivalTime}:`}
                  value={formatTime(
                    booking.pickup_info.hour.toString(),
                    booking.pickup_info.minute.toString()
                  )}
                />
                <InfoDisplay
                  label={`${locales?.Lcz_FlightDetails}:`}
                  value={booking?.pickup_info.details}
                />
              </div>
              <div className="flex items-center mt-1.5 md:mt-0 gap-1.5 md:gap-4 flex-wrap">
                <p className="car_name">
                  {booking.pickup_info.selected_option.vehicle.description}
                  <span> - </span>
                  {formatAmount(
                    booking.pickup_info.selected_option.amount,
                    booking.pickup_info.selected_option.currency.symbol
                  )}
                </p>
                <InfoDisplay
                  label={`${locales?.Lcz_NbrOfVehicles}:`}
                  value={booking?.pickup_info.nbr_of_units}
                />
                <InfoDisplay
                  label={`${locales?.Lcz_DueUponBooking}:`}
                  value={formatAmount(
                    booking?.pickup_info.total,
                    booking.pickup_info.currency.symbol
                  )}
                />
              </div>
            </div>
          </section>
        )}
        {booking.financial?.payments && (
          <section className="space-y-2.5 py-4">
            <h1 className="text-xl font-medium uppercase">{locales?.Lcz_Payments}</h1>
            <div className="overflow-x-auto">
              <table className="table-auto divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="ltr:text-left rtl:text-right">
                  <tr>
                    <th className="px-2 py-2 font-medium text-gray-900 text-center">
                      {locales?.Lcz_Date}
                    </th>
                    <th className="px-2 py-2 font-medium text-gray-900 text-end">
                      {locales?.Lcz_Amount}
                    </th>
                    <th className="px-2 py-2 font-medium text-gray-900">
                      {locales?.Lcz_Designation}
                    </th>
                    <th className="px-2 py-2 font-medium text-gray-900">
                      {locales?.Lcz_Ref}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {booking.financial?.payments?.map((p) => (
                    <tr key={p.id}>
                      <td className="px-2 whitespace-nowrap  py-1 font-medium text-gray-900 text-center">
                        {format(new Date(p.date), 'dd-MMM-yyyy')}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap text-gray-700 text-end">
                        {formatAmount(p.amount, p.currency.symbol)}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                        {p.designation || '_'}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                        {p.reference || '_'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
