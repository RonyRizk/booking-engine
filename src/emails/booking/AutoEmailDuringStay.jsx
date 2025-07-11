import React from 'react'

import EmailContainer from '../components/EmailContainer'
import PropertyHeader from '../components/PropertyHeader'
import EmailText from '../components/EmailText'
import EmailFooter from '../components/EmailFooter'
import { formatGuestName } from '../utils'



export default function AutoEmailDuringStay({ booking, setupTables, lang, locales, property }) {
    const preTableEntries = setupTables["_PRE_ARRIVAL_EMAIL"]
    const description = property?.extra_info?.find(e => e.key === "EMAIL_DURING_THE_STAY_CUSTOM_MESSAGE")?.value ?? "";
    return (
        <EmailContainer lang={lang}>
            <PropertyHeader property={property} />
            <EmailText>
                {preTableEntries.ENTRY_01.replace('[GUEST_NAME]', formatGuestName(booking.guest))}
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
