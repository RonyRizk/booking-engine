import React from 'react'


import EmailContainer from '../components/EmailContainer'
import PropertyHeader from '../components/PropertyHeader'
import EmailText from '../components/EmailText'
import EmailFooter from '../components/EmailFooter'
import { formatGuestName } from '../utils'



export default function AutoEmailDuringStay({ booking, description, lang, locales, property }) {
    return (
        <EmailContainer lang={lang}>
            <PropertyHeader property={property} />
            <EmailText>
                Dear {formatGuestName(booking.guest)},
            </EmailText>
            <EmailText dangerouslySetInnerHTML={{ __html: description }} />
            <EmailFooter>
                <EmailText>
                    {property.name}
                </EmailText>
            </EmailFooter>
        </EmailContainer>
    )
}
