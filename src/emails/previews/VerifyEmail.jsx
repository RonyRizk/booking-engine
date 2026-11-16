import React from 'react'
import { verifyEmailData as data } from './data/verifyEmail'
import VerifyEmail from '../system/VerifyEmail'
import { createLabels, EMAIL_LABELS } from "@/lib/labels";

export default function VerifyEmailPreview() {
    return (
        <VerifyEmail {...data} i18n={createLabels(EMAIL_LABELS, data.lang, { entries: data.locales })} />
    )
}
