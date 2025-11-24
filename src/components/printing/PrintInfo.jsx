import React from 'react'
import InfoDisplay from '../InfoDisplay'
import moment from 'moment'

export default function PrintInfo({ booking, mode, receiptNumber }) {
    const getBookingNumbers = () => {
        let str = []
        if (!booking.is_direct) {
            str.push(booking.channel_booking_nbr)
        }
        str.push(booking.booking_nbr)
        return str.join(' | ')
    }
    return (
        <div className='w-fit'>
            {mode === "invoice" && <InfoDisplay className={"grid grid-cols-2"} label={"Invoice no."} value={moment().format('MMMM, DD YYYY')} />}
            {mode === "creditnote" && <>
                <InfoDisplay className={"grid grid-cols-2"} label={"Credit note no."} value={"RC-12"} />
                <InfoDisplay className={"grid grid-cols-2"} label={"Original invoice no."} value={moment().format('MMMM, DD YYYY')} />
            </>}
            {mode === "receipt" && <InfoDisplay className={"grid grid-cols-2"} label={"Receipt no."} value={receiptNumber} />}
            <InfoDisplay className={"grid grid-cols-2"} label={"Date of issue"} value={moment().format('MMMM, DD YYYY')} />
            <InfoDisplay className={"grid grid-cols-2"} label={"Booking number"} value={getBookingNumbers()} />
        </div>
    )
}
