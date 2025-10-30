import React from 'react'
import EmailContainer from '../components/EmailContainer'
import EmailText from '../components/EmailText'
import SystemHeader from './SystemHeader'
import { Container } from '@react-email/components'

export default function OTPEmail({ otp, name, geo, lang, variant, property, connectedMpo }) {
    const showGeoInfo = geo?.query || geo?.country || geo?.city || geo?.org
    return (
        <EmailContainer lang={lang} connectedMpo={connectedMpo}>
            <SystemHeader name={""} connectedMpo={connectedMpo} />
            {variant === "action" && <EmailText>Dear {name},</EmailText>}
            {variant === "action" ? <EmailText>
                <b>{otp}</b> is your One-Time Password (OTP) verification code.
            </EmailText>
                : <EmailText>
                    <b>{otp}</b> is your login verification code.
                </EmailText>}
            {showGeoInfo && <Container>
                <EmailText>Login geolocation info:</EmailText>
                {geo.query && <EmailText color={!property ? undefined : geo.country?.toLowerCase() !== property?.country?.name?.toLowerCase() ? "red" : undefined}>
                    <span style={{ color: "#333333" }}>IP:</span> {geo.query}
                </EmailText>}
                {(geo.country || geo.city) && <EmailText>Location: {geo?.country}, {geo?.city}</EmailText>}
                {geo.org && <EmailText>Organization: {geo?.org}</EmailText>}
            </Container>
            }
            <EmailText color={variant !== "action" ? "red" : undefined}>
                If you did not initiate the sign-in request, we strongly advise you to change your password immediately!
            </EmailText>
        </EmailContainer >
    )
}
