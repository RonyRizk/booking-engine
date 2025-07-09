import React from 'react'
import EmailContainer from '../components/EmailContainer'
import EmailText from '../components/EmailText'
import SystemHeader from './SystemHeader'

export default function OTPEmail({ otp, name, extraData, lang, variant }) {
    return (
        <EmailContainer lang={lang}>
            <SystemHeader name={name} />
            {variant === "action" && <EmailText>Dear {name},</EmailText>}
            {variant === "action" ? <EmailText>
                <b>{otp}</b> is your One-Time Password (OTP) verification code.
            </EmailText>
                : <EmailText>
                    <b>{otp}</b> is your login verification code.
                </EmailText>}
            {extraData && <EmailText>
                Login geolocation info:<br />
                IP: {extraData?.ip}<br />
                Location: {extraData?.country.name}, {extraData?.city.name}<br />
                Organization: {extraData?.organization}<br />
            </EmailText>}
            <EmailText color={variant !== "action" ? "red" : undefined}>
                If you did not initiate the sign-in request, we strongly advise you to change your password immediately!
            </EmailText>
        </EmailContainer>
    )
}
