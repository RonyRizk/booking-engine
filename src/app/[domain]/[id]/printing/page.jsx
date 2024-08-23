/* eslint-disable @next/next/no-img-element */
import { PrintingService } from '@/lib/services/printing.service'
import { format, parse } from 'date-fns';
import React from 'react'
import "./printing.css";
import { calculateDaysBetweenDates, formatAmount, formatTime } from '@/lib/utils';
import BeLogoFooter from '@/components/assets/BeLogoFooter';
export default async function Printing({ searchParams, params }) {
    const { mode = "printing", id, lang = "en" } = searchParams;
    const printingService = new PrintingService();
    await printingService.getPrintingToken(params.id);
    const { booking, property, countries } = await printingService.getPrintingData({ bookingNumber: id, aName: params.id, language: lang });
    const BookingDetails = () => {
        return (
            <div>
                <p className="booking-number">Booking#{booking?.booking_nbr}</p>
                <div className={'reservation-details'}>
                    <p className="booked_on_date">
                        {format(parse(booking?.booked_on.date, 'yyyy-MM-dd', new Date()), 'dd-MMM-yyyy')}{' '}
                        {formatTime(booking?.booked_on.hour.toString(), booking?.booked_on.minute.toString())} |
                    </p>
                    <img src={booking?.origin.Icon} alt={booking?.origin.Label} className="origin-icon" />
                </div>
            </div>
        );
    }
    const PrintingHeader = () => {
        if (mode === 'invoice') {
            return (
                <>
                    <div>
                        <p>
                            Address:
                            <span> {property?.address}</span>
                        </p>
                        <p>
                            Phone:
                            <span>
                                {' '}
                                +{property?.country?.phone_prefix.replace('+', '') + '-' || ''}
                                {property?.phone}
                            </span>
                        </p>
                        <p>
                            Tax ID:<span>{property?.tax_nbr}</span>
                        </p>
                        <p className="property_name">{property?.name}</p>
                    </div>
                    <div>
                        <BookingDetails />
                        <p className={'invoice_reference'}>Invoice Reference:{booking?.financial.invoice_nbr}</p>
                    </div>
                </>
            );
        }
        return (
            <>
                <div>
                    <BeLogoFooter width={120} height={30} />
                    <p className="property_name">{property?.name}</p>
                </div>
                <BookingDetails />
            </>
        );
    }
    const TaxAmount = ({ room }) => {
        if (!booking?.is_direct) {
            const filtered_data = room.ota_taxes.filter(tx => tx.amount > 0);
            console.log(filtered_data)
            return filtered_data.map((d, index) => {
                return (
                    <React.Fragment key={`room_${d.name}_${index}`}>
                        <p className="label-title">
                            {d.is_exlusive ? 'Excluding' : 'Including'} {d.name}
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
        const filtered_data = property?.taxes?.filter(tx => tx.pct > 0);
        return filtered_data?.map((d, index) => {
            const amount = (room.total * d.pct) / 100;
            return (
                <React.Fragment key={`direct_room_${d.name}_${index}`}>
                    <p className="label-title">
                        {d.is_exlusive ? 'Excluding' : 'Including'} {d.name}
                    </p>
                    <p>
                        {d.pct}%: {formatAmount(amount, currency)}
                    </p>
                    {room.gross_cost > 0 && room.gross_cost !== null && <span>{formatAmount((room.cost * d.pct) / 100, currency)}</span>}
                    {index < filtered_data.length - 1 && <span>-</span>}
                </React.Fragment>
            );
        });
    }

    if (!booking) {
        return null
    }
    const totalPersons = booking?.occupancy.adult_nbr + booking?.occupancy.children_nbr;
    const currency = booking?.currency.code;
    const totalNights = calculateDaysBetweenDates(booking.from_date, booking.to_date);
    const guestCountryName = printingService.getUserCountry(countries, booking.guest.country_id)
    const privateNote = booking.extras.find(k => k.key === "private_note")

    return (
        <main className="main-container" dir='ltr'>
            <section className="header"><PrintingHeader /></section>
            <section>
                <section className="booking-details">
                    <div className='flex items-center justify-between gap-4'>
                        <p className="label-title">
                            Booked by:
                            <span className="label-value">
                                {printingService.formatGuestName(booking?.guest)} - {totalPersons} {totalPersons > 1 ? 'persons' : 'person'}
                            </span>
                        </p>
                        <p className='text-[#333] font-bold'>{booking.status.description}</p>
                    </div>
                    <p className="label-title">
                        Phone:<span className="label-value">{printingService.formatPhoneNumber(booking?.guest, booking?.is_direct)}</span>
                    </p>
                    <p className="label-title">
                        Email:<span className="label-value">{booking?.guest?.email}</span>
                    </p>
                    {guestCountryName && (
                        <p className="label-title">
                            Country:<span className="label-value">{guestCountryName}</span>
                        </p>
                    )}
                    {booking.guest.city && (
                        <p className="label-title">
                            City:<span className="label-value">{booking?.guest?.city}</span>
                        </p>
                    )}
                    <p className="label-title">
                        Arrival Time:<span className="label-value">{booking?.arrival?.description}</span>
                    </p>
                    {privateNote && <p className="label-title">
                        Private note:<span className="label-value">{privateNote.value}</span>
                    </p>}
                </section>
                <section>
                    <div className="accommodation-summary">
                        <p className="accommodation-title">ACCOMMODATION</p>
                        <p className="booking-dates">{printingService.formatBookingDates(booking?.from_date)}</p>
                        <p className="booking-dates">{printingService.formatBookingDates(booking?.to_date)}</p>
                        <p className="number-of-nights">
                            {totalNights} {totalNights === 1 ? 'night' : 'nights'}
                        </p>
                        <p className="vat-exclusion">
                            <i>{property?.tax_statement}</i>
                        </p>
                    </div>
                    <div>
                        {booking?.rooms?.map(room => (
                            <React.Fragment key={room.id}>
                                <table>
                                    <thead>
                                        <tr className={'roomtype-title'}>
                                            <td>{room.roomtype.name}</td>
                                            <td>{room.rateplan.name}</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={12}>
                                                <p className="label-title">
                                                    Guest name:<span className="label-value">{printingService.formatGuestName(room?.guest)}</span>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="policies-container">
                                    {/* <p className="policies" innerHTML={room.rateplan.cancelation}></p>
                                    <p className="policies" innerHTML={room.rateplan.guarantee}></p> */}
                                    <p className="policies" dangerouslySetInnerHTML={{ __html: room.rateplan.cancelation }}></p>
                                    <p className="policies" dangerouslySetInnerHTML={{ __html: room.rateplan.guarantee }}></p>
                                </div>
                                <div className="pricing-summary">
                                    <div className={'pricing-breakdown'}>
                                        <p className="label-title">
                                            Total:<span className="label-value">{formatAmount(room.total, currency)}</span>
                                        </p>
                                        <span>-</span>
                                        <TaxAmount room={room} />
                                    </div>
                                    <p className="label-title">
                                        Grand total:<span className="label-value">{formatAmount(room.gross_total, currency)}</span>
                                    </p>
                                    <p className="label-title">
                                        Due upon booking:<span className="label-value">{formatAmount(room.gross_guarantee, currency)}</span>
                                    </p>
                                </div>

                                {/* Rendering room dates */}
                                <div className={'room_amount_main_container'}>
                                    {room.days?.map(d => (
                                        <div className={'room_amount_container'} key={d.date}>
                                            <p className="room_amount date">{printingService.formatDate(d.date, 'YYYY-MM-DD')}</p>
                                            <p className="room_amount amount">{formatAmount(d.amount, currency)}</p>
                                        </div>
                                    ))}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </section>
            </section>
            {booking.pickup_info && (
                <section className="pickup-container">
                    <p className="pickup_title">PICKUP Yes,from {booking.pickup_info.selected_option.location.description}</p>
                    <div className={'pickup-details'}>
                        <p className="label-title">
                            Arrival date:<span className="label-value">{format(new Date(booking?.pickup_info.date), 'eeee, dd MMM yyyy')}</span>
                        </p>
                        <p className="label-title">
                            Time:<span className="label-value">{formatTime(booking.pickup_info.hour.toString(), booking.pickup_info.minute.toString())}</span>
                        </p>
                        <p className="label-title">
                            Fight details:<span className="label-value">{booking?.pickup_info.details}</span>
                        </p>

                        <p className="car_name">
                            {booking.pickup_info.selected_option.vehicle.description}
                            <span> - </span>
                            {formatAmount(booking.pickup_info.selected_option.amount, booking.pickup_info.selected_option.currency.code)}
                        </p>
                        <p className="label-title">
                            No. of Vehicles:<span className="label-value">{booking?.pickup_info.nbr_of_units}</span>
                        </p>
                        <p className="label-title">
                            Due upon booking:<span className="label-value">{formatAmount(booking?.pickup_info.total, booking.pickup_info.currency.code)}</span>
                        </p>
                    </div>
                </section>
            )}
            {booking.financial?.payments && (
                <section>
                    <table className="billing_table">
                        <caption>Billing</caption>
                        <thead>
                            <tr>
                                <th className="billing_header">Date</th>
                                <th className="billing_header">Amount</th>
                                <th className="billing_header">Designation</th>
                            </tr>

                        </thead>
                        <tbody>
                            {booking.financial?.payments?.map(p => (
                                <React.Fragment key={p.id}>
                                    <tr>
                                        <td className="billing_cell">{format(new Date(p.date), 'dd-MMM-yyyy')}</td>
                                        <td className="billing_cell">{formatAmount(p.amount, p.currency.code)}</td>
                                        <td className="billing_cell">{p.designation || '_'}</td>

                                    </tr>
                                    {p.reference && (
                                        <tr>
                                            <td colSpan={3}>Ref:{p.reference}</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}
        </main>
    )
}
