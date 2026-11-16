import React from 'react'
import { preArrivalReminder as data } from './data/autoEmails'
import AutoEmailPreArrival from '../booking/AutoEmailPreArrival'
import { createLabels, EMAIL_LABELS } from "@/lib/labels";

export default function AutoEmailPreArrivalPreview() {
    return (
        <AutoEmailPreArrival {...data} i18n={createLabels(EMAIL_LABELS, data.lang, { entries: data.locales })} />
    )
}
