import React from 'react'
import EmailContainer from '../components/EmailContainer'
import PropertyHeader from '../components/PropertyHeader'
import EmailText from '../components/EmailText'
import { formatGuestName } from '../utils'
import GuestServiceContactUs from '../booking/cmp/GuestServiceContactUs'
import EmailFooter from '../components/EmailFooter'

export default function AutoEmailPreArrival({ booking, setupTables, lang, locales, property }) {
    const preTableEntries = setupTables["_PRE_ARRIVAL_EMAIL"]
    const duration = property?.extra_info?.find(e => e.key === "EMAIL_PRE_ARRIVAL_DAYS_BEFORE_CHECK_IN")?.value ?? "";
    const description = property?.extra_info?.find(e => e.key === "EMAIL_PRE_ARRIVAL_CUSTOM_MESSAGE")?.value ?? "";
    return (
        <EmailContainer lang={lang}>
            <PropertyHeader property={property} />
            <EmailText>
                {preTableEntries.ENTRY_01.replace('[GUEST_NAME]', formatGuestName(booking.guest))}
            </EmailText>
            <EmailText>
                {preTableEntries.ENTRY_02.replace('[PROPERTY_NAME]', property.name).replace('[DAYS]', duration)}
            </EmailText>
            <EmailText dangerouslySetInnerHTML={{ __html: description }} />
            <EmailFooter>
                <EmailText>
                    {preTableEntries.ENTRY_06.replace('[BOOK_NBR]', booking.booking_nbr)}
                </EmailText>
                <GuestServiceContactUs property={property} locales={locales} />
                <EmailText>
                    {preTableEntries.ENTRY_05},<br />
                    {property.name}
                </EmailText>
            </EmailFooter>
        </EmailContainer>
    )
}
