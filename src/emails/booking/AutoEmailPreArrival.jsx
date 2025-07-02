import React from 'react'
import EmailContainer from '../components/EmailContainer'
import PropertyHeader from '../components/PropertyHeader'
import EmailText from '../components/EmailText'
import { formatGuestName } from '../utils'
import GuestServiceContactUs from '../booking/cmp/GuestServiceContactUs'
import EmailFooter from '../components/EmailFooter'

export default function AutoEmailPreArrival({ booking, description, lang, locales, property }) {
    return (
        <EmailContainer lang={lang}>
            <PropertyHeader property={property} />
            <EmailText>
                Dear {formatGuestName(booking.guest)},
            </EmailText>
            <EmailText>
                We thought of reminding you that you are arriving at {property.name} in 2 days.
            </EmailText>
            <EmailText dangerouslySetInnerHTML={{ __html: description }} />
            <EmailFooter>
                <EmailText>
                    Your Booking Number is {booking.booking_nbr}.
                </EmailText>
                <GuestServiceContactUs property={property} locales={locales} />
                <EmailText>
                    See you soon,<br />
                    {property.name}
                </EmailText>
            </EmailFooter>
        </EmailContainer>
    )
}
