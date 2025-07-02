import React from 'react'

import { postDepartureReminder as data } from './data/autoEmails'
import AutoEmailPostDeparture from '../booking/AutoEmailPostDeparture'

export default function AutoEmailPostDeparturePreview() {
    return (
        <AutoEmailPostDeparture {...data} />
    )
}
