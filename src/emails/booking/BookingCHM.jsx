import React from 'react'
import BookingInfoSection from './cmp/BookingInfoSection'

import EmailContainer from '../components/EmailContainer'
import EmailButton from '../components/EmailButton'
import PropertyHeader from '../components/PropertyHeader'
import EmailText from '../components/EmailText'

export default function BookingCHM({ booking, i18n, bookingDetailsUrl, currency, property, url, channelName, operation }) {
    const { t, lang, dir } = i18n;
    const _baseProps = { booking, i18n }
    const getOperationName = () => {
        switch (operation) {
            case "COMMIT":
                return t("Lcz_NewReservation")
            case "MODIFY":
                return t("Lcz_Modification")
            case "CANCEL":
                return t("Lcz_Cancellation")
            default:
                return null
        }
    }
    return (
        <EmailContainer lang={lang} dir={dir} connectedMpo={property?.mpo}>
            <PropertyHeader property={property} useMpoLogo />
            <EmailText color={operation === "CANCEL" ? "red" : undefined}><b>{getOperationName()} {booking.channel_booking_nbr}</b></EmailText>
            <BookingInfoSection.BookingDetails>
                {channelName && <EmailText style={{ margin: "0" }}>
                    <b>{t("Lcz_ChannelName")}:</b> {channelName}
                </EmailText>}
                <BookingInfoSection.GuestInfo {..._baseProps} />
                <BookingInfoSection.BookedOnDate {..._baseProps} />
                <BookingInfoSection.CheckInOutInfo {..._baseProps} property={property} />
                <BookingInfoSection.DurationInfo {..._baseProps} />
                <br />
                <BookingInfoSection.TotalPrice {..._baseProps} currency={currency} />
            </BookingInfoSection.BookingDetails>
            <br />
            {bookingDetailsUrl && <EmailButton dir={dir} href={bookingDetailsUrl}>
                {t("Lcz_ViewDetails")}
            </EmailButton>}
            {url && <EmailButton dir={dir} style={{ marginTop: 0 }} variant='primary' href={url}>
                {t("Lcz_OpenInChannel")}
            </EmailButton>}
        </EmailContainer>
    )
}
