import React from 'react'
import InfoDisplay from '../InfoDisplay'
import moment from 'moment'


export default function PrintInfo({ booking, mode, receiptNumber, documentId, selectedDocument, pid }) {
    const payment = ["receipt", "creditreceipt"].includes(mode) ? booking?.financial?.payments?.find(
        (p) => p.system_id?.toString() === pid?.toString()
    ) : null
    const originalPayment = payment && mode === "creditreceipt" ? booking?.financial?.payments?.find(
        (p) => p.credit_receipt_nbr?.toString() === payment?.system_id?.toString(),
    ) : null
    const getBookingNumbers = () => {
        let str = []
        if (!booking.is_direct) {
            str.push(booking.channel_booking_nbr)
        }
        str.push(booking.booking_nbr)
        return str.join(' | ')
    }
    const formatDate = (date) => {
        if (!date || !date.isValid()) return null
        return date.locale('en').format('MMMM DD, YYYY')
    }
    const getDocDate = () => {
        switch (mode) {
            case "receipt":
            case "creditreceipt": {

                return payment?.date ? formatDate(moment(payment.date)) : null;
            }
            case "proforma":
                return formatDate(moment())
            default:
                return formatDate(moment(selectedDocument.date, 'YYYY-MM-DD'))
        }
    }
    return (
        <div className='w-fit'>
            {["invoice", "proforma"].includes(mode) && <InfoDisplay className={""} label={mode === "invoice" ? "Invoice no.:" : "Reference:"} value={documentId} />}
            {mode === "creditnote" && <>
                <InfoDisplay className={""} label={"Credit note no.:"} value={selectedDocument?.credit_note?.nbr} />
                <i><InfoDisplay className={""} label={"For original invoice no.:"} value={documentId} /></i>
            </>}
            {mode === "creditreceipt" && <>
                <InfoDisplay className={""} label={"Credit receipt no.:"} value={payment?.credit_receipt_nbr} />
                <i><InfoDisplay className={""} label={"For original receipt no.:"} value={originalPayment?.receipt_nbr} /></i>
            </>}
            {mode === "receipt" && <InfoDisplay className={""} label={"Receipt no.:"} value={receiptNumber} />}

            <InfoDisplay className={""} label={"Date of issue:"} value={
                getDocDate()
            } />
            <InfoDisplay className={""} label={"Booking"} value={"#" + getBookingNumbers()} />
        </div>
    )
}
