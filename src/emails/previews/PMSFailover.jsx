import React from 'react'
import { pmsFailOverData as data } from './data/pmsFailover'
import PMSFailover from '../system/PMSFailover'
import { createLabels, EMAIL_LABELS } from "@/lib/labels";

export default function PMSFailoverPreview() {
    return (
        <PMSFailover {...data} i18n={createLabels(EMAIL_LABELS, data.lang, { entries: data.locales })} />
    )
}
