import React from 'react'
import EmailContainer from '../components/EmailContainer'
import SystemHeader from './SystemHeader'
import EmailText from '../components/EmailText'
import EmailButton from '../components/EmailButton'
import EmailLink from '../components/EmailLink'

export default function VerifyEmail({ name, lang, url }) {
    return (
        <EmailContainer lang={lang}>
            <SystemHeader name={name} />
            <EmailText>
                Please verify your email so you can login to igloorooms extranet. If you were not trying to login, we strongly advise you to change your Admin password immediately.
            </EmailText>
            <EmailButton href={url}>Verify email</EmailButton>
            <EmailText>
                If you have any questions, concerns, or require assistance, please do not hesitate to contact igloorooms Support <EmailLink>https://help.igloorooms.com</EmailLink>
            </EmailText>
        </EmailContainer>
    )
}
