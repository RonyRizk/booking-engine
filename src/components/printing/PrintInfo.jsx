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
            {["invoice", "proforma"].includes(mode) && <InfoDisplay className={""} label={mode === "invoice" ? "Invoice no.:" : "Reference:"} value={documentId} />}
            {mode === "creditnote" && <>
                <InfoDisplay className={""} label={"Credit note no.:"} value={selectedDocument?.credit_note?.nbr} />
                <InfoDisplay className={""} label={"Original invoice no.:"} value={documentId} />
            </>}
            {mode === "receipt" && <InfoDisplay className={""} label={"Receipt no.:"} value={receiptNumber} />}
            <InfoDisplay className={""} label={"Date of issue:"} value={
                ["receipt", 'proforma'].includes(mode) ? moment().locale('en').format('MMMM DD, YYYY') : moment(selectedDocument.date, 'YYYY-MM-DD').locale('en').format('MMMM, DD YYYY')
            } />
            <InfoDisplay className={""} label={"Booking"} value={"#" + getBookingNumbers()} />
        </div>
    )
}
