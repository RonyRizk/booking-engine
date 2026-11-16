import React from 'react'
import { duringTheStayReminder as data } from './data/autoEmails'
import AutoEmailDuringStay from '../booking/AutoEmailDuringStay'
import { createLabels, EMAIL_LABELS } from "@/lib/labels";

export default function AutoEmailDuringStayPreview() {
    return (
        <AutoEmailDuringStay {...data} i18n={createLabels(EMAIL_LABELS, data.lang, { entries: data.locales })} />
    )
}
