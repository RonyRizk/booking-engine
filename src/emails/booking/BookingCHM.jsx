import React from 'react'
import BookingInfoSection from './cmp/BookingInfoSection'

import EmailContainer from '../components/EmailContainer'
import EmailButton from '../components/EmailButton'
import PropertyHeader from '../components/PropertyHeader'
import EmailText from '../components/EmailText'

export default function BookingCHM({ booking, lang, locales, bookingDetailsUrl, currency, property, url, channelName, operation }) {

    const _baseProps = { booking, locales }
    const getOperationName = () => {
        switch (operation) {
            case "COMMIT":
                return locales.Lcz_NewReservation
            case "MODIFY":
                return locales.Lcz_Modification
            case "CANCEL":
                return locales.Lcz_Cancellation
            default:
                return null
        }
    }
    return (
        <EmailContainer lang={lang} connectedMpo={property?.mpo}>
            <PropertyHeader property={property} useMpoLogo />
            <EmailText color={operation === "CANCEL" ? "red" : undefined}><b>{getOperationName()} {booking.channel_booking_nbr}</b></EmailText>
            <BookingInfoSection.BookingDetails>
                {channelName && <EmailText style={{ margin: "0" }}>
                    <b>{locales?.Lcz_ChannelName}:</b> {channelName}
                </EmailText>}
                <BookingInfoSection.GuestInfo {..._baseProps} />
                <BookingInfoSection.BookedOnDate {..._baseProps} />
                <BookingInfoSection.CheckInOutInfo {..._baseProps} property={property} />
                <BookingInfoSection.DurationInfo {..._baseProps} />
                <br />
                <BookingInfoSection.TotalPrice {..._baseProps} currency={currency} />
            </BookingInfoSection.BookingDetails>
            <br />
            {bookingDetailsUrl && <EmailButton href={bookingDetailsUrl}>
                View details
            </EmailButton>}
            {url && <EmailButton style={{ marginTop: 0 }} variant='primary' href={url}>
                Open in channel
            </EmailButton>}
        </EmailContainer>
    )
}
