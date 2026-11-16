import React from 'react'
import EmailContainer from '../components/EmailContainer'
import EmailText from '../components/EmailText'
import SystemHeader from './SystemHeader'
import { Container } from '@react-email/components'
import { interpolate } from '../utils'

export default function OTPEmail({ otp, name, geo, i18n, variant, property, connectedMpo }) {
    const { t, lang, dir } = i18n;
    const showGeoInfo = geo?.query || geo?.country || geo?.city || geo?.org
    return (
        <EmailContainer lang={lang} dir={dir} connectedMpo={connectedMpo}>
            <SystemHeader name={""} connectedMpo={connectedMpo} />
            {variant === "action" && <EmailText>{t("Lcz_DearX", name)}</EmailText>}
            <EmailText>
                {interpolate(t(variant === "action" ? "Lcz_OtpActionCode" : "Lcz_OtpLoginCode"), <b>{otp}</b>)}
            </EmailText>
            {showGeoInfo && <Container>
                <EmailText>{t("Lcz_LoginGeolocationInfo")}</EmailText>
                {geo.query && <EmailText color={!property ? undefined : geo.country?.toLowerCase() !== property?.country?.name?.toLowerCase() ? "red" : undefined}>
                    <span style={{ color: "#333333" }}>{t("Lcz_IP")}:</span> <span dir="ltr">{geo.query}</span>
                </EmailText>}
                {(geo.country || geo.city) && <EmailText>{t("Lcz_Location")}: {geo?.country}, {geo?.city}</EmailText>}
                {geo.org && <EmailText>{t("Lcz_Organization")}: {geo?.org}</EmailText>}
            </Container>
            }
            <EmailText color={variant !== "action" ? "red" : undefined}>
                {t("Lcz_SignInNotInitiatedWarning")}
            </EmailText>
        </EmailContainer >
    )
}
