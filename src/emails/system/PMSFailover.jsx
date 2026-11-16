import React from 'react'
import EmailContainer from '../components/EmailContainer'
import SystemHeader from './SystemHeader'
import EmailText from '../components/EmailText'
import EmailButton from '../components/EmailButton'
import BookingInfoSection from '../booking/cmp/BookingInfoSection'


export default function PMSFailover({
    booking,
    currency,
    i18n,
    property,
    reason,
    connectedMpo
}) {
    const { t, lang, dir } = i18n;
    const _baseProps = { booking, i18n }
    return (
        <EmailContainer lang={lang} dir={dir} connectedMpo={connectedMpo}>
            <SystemHeader name={property.name} connectedMpo={connectedMpo} />
            <EmailText color='red' variant='title'>{t("Lcz_PmsDeliveryFailure", booking.booking_nbr)}</EmailText>
            <EmailText variant='subtitle'>
                {t("Lcz_PmsRetryNotice")}
            </EmailText>
            <EmailText>
                <br /> <b>{t("Lcz_PmsAnswer")}</b>: {reason}
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
            <EmailButton dir={dir} href="https://x.igloorooms.com/manage/AcBookingEdit.aspx?IRID=[BH_ID]&Ran=[RANDOM]">{t("Lcz_ViewDetails")}</EmailButton>
        </EmailContainer>
    )
}
