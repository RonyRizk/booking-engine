import React from 'react'
import EmailContainer from '../components/EmailContainer'
import SystemHeader from './SystemHeader'
import EmailText from '../components/EmailText'
import EmailButton from '../components/EmailButton'
import BookingInfoSection from '../booking/cmp/BookingInfoSection'


export default function PMSFailover({
    booking,
    currency,
    lang,
    locales,
    property,
    reason,
}) {
    const _baseProps = { booking, locales }
    return (
        <EmailContainer lang={lang}>
            <SystemHeader name={property.name} />
            <EmailText color='red' variant='title'>PMS delivery failure: Booking#{booking.booking_nbr}</EmailText>
            <EmailText variant='subtitle'>
                We will keep retrying during the next 24 hours.
            </EmailText>
            <EmailText>
                <br /> <b>PMS Answer</b>: {reason}
            </EmailText>
            <BookingInfoSection.BookingDetails>
                <BookingInfoSection.GuestInfo {..._baseProps} />
                <BookingInfoSection.BookedOnDate {..._baseProps} />
                <BookingInfoSection.CheckInOutInfo {..._baseProps} property={property} />
                <BookingInfoSection.DurationInfo {..._baseProps} />
                <br />
                <BookingInfoSection.TotalPrice {..._baseProps} currency={currency} />
            </BookingInfoSection.BookingDetails>
            <br />
            {/* //TODO: ask rony */}
            <EmailButton href="https://x.igloorooms.com/manage/AcBookingEdit.aspx?IRID=[BH_ID]&Ran=[RANDOM]">View details</EmailButton>
        </EmailContainer>
    )
}
