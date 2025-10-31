import React from 'react'

import { formatGuestName } from '../utils'
import EmailContainer from '../components/EmailContainer'
import PropertyHeader from '../components/PropertyHeader'
import EmailText from '../components/EmailText'
import EmailFooter from '../components/EmailFooter'

export default function AutoEmailPostDeparture({ booking, setupTables, lang, locales, property }) {
    const postTableEntries = setupTables["_POST_DEPARTURE_EMAIL"]
    const description = property?.extra_info?.find(e => e.key === "EMAIL_POST_DEPARTURE_CUSTOM_MESSAGE")?.value ?? "";
    return (
        <EmailContainer lang={lang} connectedMpo={property.mpo}>
            <PropertyHeader property={property} />
            <EmailText>
                {postTableEntries.ENTRY_01.replace('[GUEST_NAME]', formatGuestName(booking.guest))}
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
