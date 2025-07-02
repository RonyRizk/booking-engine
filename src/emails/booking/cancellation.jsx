import React from 'react'

import BookingHeader from "./cmp/BookingHeader";
import GuestServiceContactUs from "./cmp/GuestServiceContactUs";
import BookingDetails from "./cmp/BookingDetails";

import EmailContainer from "../components/EmailContainer";
import EmailText from "../components/EmailText";
import EmailFooter from '../components/EmailFooter';

export default function BookingCancellationEmail({
    locales,
    totalPersons,
    booking,
    currency,
    totalNights,
    property,
    lang,
    penaltyStatement,
}) {
    const bookingEmail = property.contacts?.find(
        (c) => c.type === "booking"
    )?.email;
    const phone = `+${property?.country?.phone_prefix?.replace("+", "") + "-" || ""}${property?.phone}`;

    return (
        <EmailContainer lang={lang}>
            <BookingHeader
                bookingEmail={bookingEmail}
                totalPersons={totalPersons}
                totalNights={totalNights}
                phone={phone}
                booking={booking}
                property={property}
                locales={locales}
                mode={"printing"}
            />
            {penaltyStatement && <>
                <EmailText variant="subtitle">{locales?.Lcz_CancelationPenalty}</EmailText>
                <EmailText>{penaltyStatement}</EmailText>
            </>}
            <EmailText variant="subtitle">{locales?.Lcz_CancellationDetails}</EmailText>
            <BookingDetails booking={booking} lang={lang} property={property} locales={locales} currency={currency} />
            <EmailFooter>
                <GuestServiceContactUs property={property} locales={locales} />
            </EmailFooter>
        </EmailContainer>
    );
}
