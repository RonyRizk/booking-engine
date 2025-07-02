import React from 'react'

import { cancelledBookingData as data } from './data/cancelledBooking';
import BookingCancellationEmail from '../booking/cancellation';

export default function BookingCancellationEmailPreview() {
    return (
        <BookingCancellationEmail {...data} />
    );
}

