import React from 'react'
import { paymentReminder as data } from './data/autoEmails'
import PaymentReminderEmail from '../booking/PaymentReminder'
import { createLabels, EMAIL_LABELS } from "@/lib/labels";

export default function PaymentReminderPreview() {
    return (
        <PaymentReminderEmail {...data} i18n={createLabels(EMAIL_LABELS, data.lang, { entries: data.locales })} />
    )
}
