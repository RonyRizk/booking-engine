import React from 'react'
import InfoDisplay from '../InfoDisplay'
import moment from 'moment'
import { getI18n } from '@/lib/printing-i18n'


export default function PrintInfo({ booking, mode, receiptNumber, documentId, selectedDocument, pid }) {
    const { t, formatDate: formatI18nDate } = getI18n()
    const payment = ["receipt", "creditreceipt", "refund"].includes(mode) ? booking?.financial?.payments?.find(
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
        return formatI18nDate(date, 'long')
    }
    const getDocDate = () => {
        switch (mode) {
            case "receipt":
            case "creditreceipt":
            case "refund": {

                return payment?.date ? formatDate(moment(payment.date)) : null;
            }
            case "proforma":
                return formatDate(moment())
            default:
                return selectedDocument?.date ? formatDate(moment(selectedDocument.date, 'YYYY-MM-DD')) : null
        }
    }
    return (
        <div className='w-fit max-w-full space-y-[2pt]'>
            {["invoice", "proforma"].includes(mode) && <InfoDisplay className={""} label={`${t(mode === "invoice" ? "Lcz_InvoiceNo" : "Lcz_Reference")}:`} value={documentId} />}
            {mode === "creditnote" && <>
                <InfoDisplay className={""} label={`${t("Lcz_CreditNoteNo")}:`} value={selectedDocument?.credit_note?.nbr} />
                <i><InfoDisplay className={""} label={`${t("Lcz_ForOriginalInvoiceNo")}:`} value={documentId} /></i>
            </>}
            {["creditreceipt", "refund"].includes(mode) && <>
                <InfoDisplay className={""} label={`${t("Lcz_CreditReceiptNo")}:`} value={payment?.credit_receipt_nbr} />
                {mode === "creditreceipt" && <i><InfoDisplay className={""} label={`${t("Lcz_ForOriginalReceiptNo")}:`} value={originalPayment?.receipt_nbr} /></i>}
            </>}
            {mode === "receipt" && <InfoDisplay className={""} label={`${t("Lcz_ReceiptNo")}:`} value={receiptNumber} />}

            <InfoDisplay className={""} label={`${t("Lcz_DateOfIssue")}:`} value={
                getDocDate()
            } />
            <InfoDisplay className={""} label={t("Lcz_Booking")} value={"#" + getBookingNumbers()} />
        </div>
    )
}
