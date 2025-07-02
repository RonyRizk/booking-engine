import React from 'react'
import { otaData as data } from './data/ota'
import BookingCHM from '../booking/BookingCHM'


export default function BookingCHMPreview() {
    return (
        <BookingCHM {...data} />
    )
}
