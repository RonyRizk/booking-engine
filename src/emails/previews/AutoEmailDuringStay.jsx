import React from 'react'
import { duringTheStayReminder as data } from './data/autoEmails'
import AutoEmailDuringStay from '../booking/AutoEmailDuringStay'

export default function AutoEmailDuringStayPreview() {
    return (
        <AutoEmailDuringStay {...data} />
    )
}
