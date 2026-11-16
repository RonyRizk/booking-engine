import React from 'react'

import BookingHeader from "./cmp/BookingHeader";
import GuestServiceContactUs from "./cmp/GuestServiceContactUs";
import BookingDetails from "./cmp/BookingDetails";

import EmailContainer from "../components/EmailContainer";
import EmailText from "../components/EmailText";
import EmailFooter from '../components/EmailFooter';

export default function BookingCancellationEmail({
    i18n,
    totalPersons,
    booking,
    currency,
    totalNights,
    property,
    penaltyStatement,
    phone,
}) {
    const { t, lang, dir } = i18n;
    const bookingEmail = property.contacts?.find(
        (c) => c.type === "booking"
    )?.email;

    return (
        <EmailContainer lang={lang} dir={dir} connectedMpo={property.mpo}>
            <BookingHeader
                bookingEmail={bookingEmail}
                totalPersons={totalPersons}
                totalNights={totalNights}
                phone={phone}
                booking={booking}
                property={property}
                i18n={i18n}
                mode={"printing"}
            />
            {penaltyStatement && <>
                <EmailText variant="subtitle">{t("Lcz_CancelationPenalty")}</EmailText>
                <EmailText>{penaltyStatement}</EmailText>
            </>}
            <EmailText variant="subtitle">{t("Lcz_CancellationDetails")}</EmailText>
            <BookingDetails booking={booking} property={property} i18n={i18n} currency={currency} />
            <EmailFooter>
                <GuestServiceContactUs property={property} i18n={i18n} />
            </EmailFooter>
        </EmailContainer>
    );
}
