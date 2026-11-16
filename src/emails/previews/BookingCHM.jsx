import React from 'react'
import { otaData as data } from './data/ota'
import BookingCHM from '../booking/BookingCHM'
import { createLabels, EMAIL_LABELS } from "@/lib/labels";


export default function BookingCHMPreview() {
    return (
        <BookingCHM {...data} i18n={createLabels(EMAIL_LABELS, data.lang, { entries: data.locales })} />
    )
}
