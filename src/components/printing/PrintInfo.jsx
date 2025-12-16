import React from 'react'
import InfoDisplay from '../InfoDisplay'
import moment from 'moment'

export default function PrintInfo({ booking, mode, receiptNumber, documentId, selectedDocument }) {
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
            {mode === "invoice" && <InfoDisplay className={"grid grid-cols-2"} label={"Invoice no."} value={documentId} />}
            {mode === "creditnote" && <>
                <InfoDisplay className={"grid grid-cols-2"} label={"Credit note no."} value={selectedDocument?.credit_note?.nbr} />
                <InfoDisplay className={"grid grid-cols-2"} label={"Original invoice no."} value={documentId} />
            </>}
            {mode === "receipt" && <InfoDisplay className={"grid grid-cols-2"} label={"Receipt no."} value={receiptNumber} />}
            <InfoDisplay className={"grid grid-cols-2"} label={"Date of issue"} value={
                mode === "receipt" ? moment().format('MMMM, DD YYYY') : moment(selectedDocument.date, 'YYYY-MM-DD').format('MMMM, DD YYYY')
            } />
            <InfoDisplay className={"grid grid-cols-2"} label={"Booking number"} value={getBookingNumbers()} />
        </div>
    )
}
