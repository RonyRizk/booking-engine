import React from 'react'
import { otpData as data } from './data/otp'
import OTPEmail from '../system/otp'
import { createLabels, EMAIL_LABELS } from "@/lib/labels";

export default function OTPEmailPreview() {
    return (
        <OTPEmail {...data} i18n={createLabels(EMAIL_LABELS, data.lang, { entries: data.locales })} />
    )
}
