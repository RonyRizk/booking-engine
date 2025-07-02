import React from 'react'
import { preArrivalReminder as data } from './data/autoEmails'
import AutoEmailPreArrival from '../booking/AutoEmailPreArrival'

export default function AutoEmailPreArrivalPreview() {
    return (
        <AutoEmailPreArrival {...data} />
    )
}
