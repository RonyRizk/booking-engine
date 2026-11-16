import React from 'react'

import { postDepartureReminder as data } from './data/autoEmails'
import AutoEmailPostDeparture from '../booking/AutoEmailPostDeparture'
import { createLabels, EMAIL_LABELS } from "@/lib/labels";

export default function AutoEmailPostDeparturePreview() {
    return (
        <AutoEmailPostDeparture {...data} i18n={createLabels(EMAIL_LABELS, data.lang, { entries: data.locales })} />
    )
}
