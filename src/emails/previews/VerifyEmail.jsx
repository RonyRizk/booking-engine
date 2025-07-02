import React from 'react'
import { verifyEmailData as data } from './data/verifyEmail'
import VerifyEmail from '../system/VerifyEmail'

export default function VerifyEmailPreview() {
    return (
        <VerifyEmail {...data} />
    )
}
