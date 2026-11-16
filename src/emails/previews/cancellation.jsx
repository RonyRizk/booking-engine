import React from 'react'

import { cancelledBookingData as data } from './data/cancelledBooking';
import BookingCancellationEmail from '../booking/cancellation';
import { createLabels, EMAIL_LABELS } from "@/lib/labels";

export default function BookingCancellationEmailPreview() {
    return (
        <BookingCancellationEmail {...data} i18n={createLabels(EMAIL_LABELS, data.lang, { entries: data.locales })} />
    );
}

