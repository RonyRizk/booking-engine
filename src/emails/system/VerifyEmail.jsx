import React from 'react'
import EmailContainer from '../components/EmailContainer'
import SystemHeader from './SystemHeader'
import EmailText from '../components/EmailText'
import EmailButton from '../components/EmailButton'
import EmailLink from '../components/EmailLink'

export default function VerifyEmail({ name, i18n, url, connectedMpo }) {
    const { t, lang, dir } = i18n;
    return (
        <EmailContainer lang={lang} dir={dir} connectedMpo={connectedMpo}>
            <SystemHeader name={name} connectedMpo={connectedMpo} />
            <EmailText>
                {t("Lcz_VerifyEmailIntro")}
            </EmailText>
            <EmailButton dir={dir} href={url}>{t("Lcz_VerifyEmail")}</EmailButton>
            <EmailText>
                {t("Lcz_ContactSupport")} <EmailLink href="https://help.igloorooms.com">https://help.igloorooms.com</EmailLink>
            </EmailText>
        </EmailContainer>
    )
}
