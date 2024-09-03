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

const InfoDisplay = ({ label, value }) => {
  return (
    <div className="flex items-center gap-1">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  );
};
export default async function Printing({ searchParams, params }) {
  const { mode = "printing", id, lang = "en" } = searchParams;
  const printingService = new PrintingService();
  await printingService.getPrintingToken(params.id);
  const { booking, property, countries } =
    await printingService.getPrintingData({
      bookingNumber: id,
      aName: params.id,
      language: lang,
    });
  const BookingDetails = () => {
    return (
      <div>
        <p className="text-xl  text-gray-900">Booking#{booking?.booking_nbr}</p>
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
            className="size-8 ml-2"
          />
        </div>
        {mode === "invoice" && (
          <div className="flex md:justify-end">
            <InfoDisplay label={"Tax ID:"} value={property?.tax_nbr} />
          </div>
        )}
      </div>
    );
  };
  const PrintingHeader = () => {
    if (mode === "invoice") {
      return (
        <>
          <div>
            <img
              src={property.space_theme.logo}
              alt="logo"
              className="aspect-[16/4] h-14 hidden md:block"
            />
            <InfoDisplay
              label={"Address:"}
              value={[
                property?.address ?? null,
                property?.city.name ?? null,
                property?.country.name ?? null,
              ]
                .filter((f) => f !== null)
                .join(", ")}
            />
            <InfoDisplay
              label={"Phone:"}
              value={`+${property?.country?.phone_prefix.replace("+", "") + " -" || ""
                } ${property?.phone}`}
            />
          </div>
          <div>
            <BookingDetails />
          </div>
        </>
      );
    }
    return (
      <>
        <div>
          <img
            src={property.space_theme.logo}
            alt="logo"
            className="aspect-[16/4] h-14 hidden md:block"
          />
          <InfoDisplay
            label={"Address:"}
            value={[
              property?.address ?? null,
              property?.city.name ?? null,
              property?.country.name ?? null,
            ]
              .filter((f) => f !== null)
              .join(", ")}
          />
        </div>
        <BookingDetails />
      </>
    );
  };
  const TaxAmount = ({ room }) => {
    if (!booking?.is_direct) {
      const filtered_data = room.ota_taxes.filter((tx) => tx.amount > 0);
      console.log(filtered_data);
      return filtered_data.map((d, index) => {
        return (
          <React.Fragment key={`room_${d.name}_${index}`}>
            <p className="label-title">
              {d.is_exlusive ? "Excluding" : "Including"} {d.name}
            </p>
            <p>
              {d.currency.symbol}
              {d.amount}
            </p>
            {index < filtered_data.length - 1 && <span>-</span>}
          </React.Fragment>
        );
      });
    }
    const filtered_data = property?.taxes?.filter((tx) => tx.pct > 0);
    return filtered_data?.map((d, index) => {
      const amount = (room.total * d.pct) / 100;
      return (
        <React.Fragment key={`direct_room_${d.name}_${index}`}>
          <p className="label-title">
            {d.is_exlusive ? "Excluding" : "Including"} {d.name}
          </p>
          <p>
            {d.pct}%: {formatAmount(amount, currency)}
          </p>
          {room.gross_cost > 0 && room.gross_cost !== null && (
            <span>{formatAmount((room.cost * d.pct) / 100, currency)}</span>
          )}
          {index < filtered_data.length - 1 && <span>-</span>}
        </React.Fragment>
      );
    });
  };

  if (!booking) {
    return null;
  }
  //48157715406
  console.log(booking.rooms)
  const totalPersons =
    booking?.occupancy.adult_nbr + booking?.occupancy.children_nbr;
  const currency = booking?.currency.code;
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
    <main className="main-container text-gray-800 p-4 py-0" dir="ltr">
      <section className="py-4">
        <div className="flex flex-col-reverse md:flex-row md:justify-between md:w-full">
          <PrintingHeader />
        </div>
        {mode === "invoice" && <div className="flex items-center w-full justify-between">
          <p className="property_name">{property?.name}</p>
          <InfoDisplay
            label={"Invoice Reference:"}
            value={booking?.financial.invoice_nbr}
          />
        </div>}
      </section>
      <section>
        <section className="py-4 border-y border-gray-300">
          <div className="flex items-center justify-between gap-4">
            <InfoDisplay
              label={"Booked by:"}
              value={`${printingService.formatGuestName(
                booking?.guest
              )} - ${totalPersons} ${totalPersons > 1 ? "persons" : "person"}`}
            />
            <p className="text-gray-900 text-lg font-semibold">
              {booking.status.description}
            </p>
          </div>
          <InfoDisplay
            label={"Phone:"}
            value={printingService.formatPhoneNumber(
              booking?.guest,
              booking?.is_direct
            )}
          />
          <InfoDisplay label={"Email:"} value={booking?.guest?.email} />
          {guestCountryName && (
            <InfoDisplay label={"Country:"} value={guestCountryName} />
          )}
          <InfoDisplay
            label={"Arrival Time:"}
            value={booking?.arrival?.description}
          />
          {privateNote && <InfoDisplay label={"Private note:"} value={privateNote.value} />}
        </section>
        <section className="pt-4">
          <div className="flex items-center justify-between flex-wrap mb-4">
            <p className="accommodation-title">ACCOMMODATION</p>
            <p className="booking-dates">
              {printingService.formatBookingDates(booking?.from_date)}
            </p>
            <p className="booking-dates">
              {printingService.formatBookingDates(booking?.to_date)}
            </p>
            <p className="number-of-nights">
              {totalNights} {totalNights === 1 ? "night" : "nights"}
            </p>
            <p className="vat-exclusion">
              <i>{property?.tax_statement}</i>
            </p>
          </div>
          <div>
            {booking?.rooms?.map((room, idx) => (
              <section key={room.id} className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xl mb-2.5">
                  <p>{room.roomtype.name}</p>
                  <p>{room.rateplan.short_name || room.rateplan.name}</p>
                </div>
                <div className="">
                  <InfoDisplay
                    label={"Guest name:"}
                    value={printingService.formatGuestName(room?.guest)}
                  />
                  <p
                    className=""
                    dangerouslySetInnerHTML={{
                      __html: room.rateplan.cancelation,
                    }}
                  ></p>
                  <p
                    className=""
                    dangerouslySetInnerHTML={{
                      __html: room.rateplan.guarantee,
                    }}
                  ></p>
                </div>
                <div className="pricing-summary">
                  <div className={"pricing-breakdown"}>
                    <InfoDisplay
                      label={"Total:"}
                      value={formatAmount(room.total, currency)}
                    />
                    <span>-</span>
                    <TaxAmount room={room} />
                  </div>
                  <div className="flex flex-col items-end">
                    <InfoDisplay
                      label={"Grand total:"}
                      value={formatAmount(room.gross_total, currency)}
                    />
                    <InfoDisplay
                      label={"Due upon booking:"}
                      value={formatAmount(room.gross_guarantee, currency)}
                    />
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
                      <div className="room_amount amount">
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
            PICKUP Yes, from{" "}
            {booking.pickup_info.selected_option.location.description}
          </p>
          <div>
            <div className="flex items-center gap-1.5 md:gap-4 flex-wrap ">
              <InfoDisplay
                label={"Arrival date:"}
                value={format(
                  new Date(booking?.pickup_info.date),
                  "eeee, dd MMM yyyy"
                )}
              />
              <InfoDisplay
                label={"Time:"}
                value={formatTime(
                  booking.pickup_info.hour.toString(),
                  booking.pickup_info.minute.toString()
                )}
              />
              <InfoDisplay
                label={"Fight details:"}
                value={booking?.pickup_info.details}
              />
            </div>
            <div className="flex items-center mt-1.5 md:mt-0 gap-1.5 md:gap-4 flex-wrap">
              <p className="car_name">
                {booking.pickup_info.selected_option.vehicle.description}
                <span> - </span>
                {formatAmount(
                  booking.pickup_info.selected_option.amount,
                  booking.pickup_info.selected_option.currency.code
                )}
              </p>
              <InfoDisplay
                label={"No. of Vehicles:"}
                value={booking?.pickup_info.nbr_of_units}
              />
              <InfoDisplay
                label={"Due upon booking:"}
                value={formatAmount(
                  booking?.pickup_info.total,
                  booking.pickup_info.currency.code
                )}
              />
            </div>
          </div>
        </section>
      )}
      {booking.financial?.payments && (
        <section className="space-y-4 py-4">
          <h1 className="text-xl font-medium uppercase">Billing</h1>
          {/* <div className="space-y-2.5 md:hidden">
            {booking.financial?.payments?.map((p) => (
              <div key={p.id} className="bg-gray-100 rounded-md p-4">
                <p className="flex items-center gap-1 text-gray-800">
                  <span className="font-medium ">Date:</span>
                  <span>{format(new Date(p.date), "dd-MMM-yyyy")}</span>
                </p>
                <p className="flex items-center gap-1 text-gray-800">
                  <span>Amount:</span>
                  <span>{formatAmount(p.amount, p.currency.code)}</span>
                </p>
                {p.designation && (
                  <p className="flex items-center gap-1 text-gray-800">
                    <span>Designation:</span>
                    <span>{p.designation || "_"}</span>
                  </p>
                )}
                {p.reference && (
                  <p className="flex items-center gap-1 text-gray-800">
                    <span>Ref:</span>
                    <span>{p.reference}</span>
                  </p>
                )}
              </div>
            ))}
          </div> */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Amount
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Designation
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Ref
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {booking.financial?.payments?.map((p) => (
                  <tr key={p.id}>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {format(new Date(p.date), "dd-MMM-yyyy")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {formatAmount(p.amount, p.currency.code)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {p.designation || "_"}
                    </td>
                    {p.reference && (
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {p.reference}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
