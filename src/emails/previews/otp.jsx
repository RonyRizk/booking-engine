import React from 'react'
import { otpData as data } from './data/otp'
import OTPEmail from '../system/otp'

export default function OTPEmailPreview() {
    return (
        <OTPEmail {...data} />
    )
}
