import React from "react";
import EmailContainer from "../components/EmailContainer";
import BookingHeader from "./cmp/BookingHeader";
import EmailText from "../components/EmailText";
import GuestServiceContactUs from "./cmp/GuestServiceContactUs";
import BookingDetails from "./cmp/BookingDetails";
import EmailFooter from "../components/EmailFooter";

export default function BookingEmail({
    locales,
    totalPersons,
    booking,
    currency,
    totalNights,
    property,
    lang,
    phone,
    bookingEmail,
}) {
    const prepaymentCode = booking.extras?.find(
        (e) => e.key === "payment_code"
    )?.value;
    const getPaymentMessage = () => {
        switch (prepaymentCode) {
            case "001":
                return `<p>${locales?.Lcz_Payment_OfflineCreditCard}</p>`;
            case "005":
                const method = property.allowed_payment_methods?.find(
                    (e) => e.code === "005"
                );
                if (!method) {
                    return;
                }
                let selectedLocalizable = method.localizables?.find(
                    (l) => l.language.code.toLowerCase() === lang
                );
                if (!selectedLocalizable) {
                    selectedLocalizable = method.localizables?.find(
                        (l) => l.language.code.toLowerCase() === "en"
                    );
                }
                return selectedLocalizable.description.replace(
                    /<p>/g,
                    '<p style="margin:0;padding:0;">'
                );
            default:
                return `<p>${locales?.Lcz_Payment_NotFullyPaid}</p>`;
        }
    };
    return (
        <EmailContainer lang={lang} connectedMpo={property.mpo}>
            <BookingHeader
                bookingEmail={bookingEmail}
                totalPersons={totalPersons}
                totalNights={totalNights}
                requestedCancellation={booking.is_requested_to_cancel}
                phone={phone}
                booking={booking}
                property={property}
                locales={locales}
                mode={"printing"}
            />
            <EmailText variant="subtitle">{locales?.Lcz_Booking_details}</EmailText>
            <BookingDetails booking={booking} lang={lang} property={property} locales={locales} currency={currency} />
            <EmailText variant="subtitle">{locales?.Lcz_PaymentDetails}</EmailText>
            <EmailText>{locales?.Lcz_YourBookingIsGuaranteed}</EmailText>
            <div
                style={styles.paymentMessage}
                dangerouslySetInnerHTML={{ __html: getPaymentMessage() }}
            ></div>

            <EmailFooter>
                <EmailText style={styles.contactText} dangerouslySetInnerHTML={{ __html: property.description.important_info }} />
                <GuestServiceContactUs property={property} locales={locales} />
                <EmailText>
                    {locales?.Lcz_Look_forward} {property.name}
                </EmailText>
            </EmailFooter>
        </EmailContainer>
    );
}
const styles = {
    paymentSection: { marginTop: "20px", width: "100%" },
    paymentMessage: {
        width: "100%",
        marginTop: "0",
        marginRight: "0",
        marginBottom: "10px",
        marginLeft: "0",
        paddingTop: "0",
        paddingRight: "0",
        paddingBottom: "0",
        paddingLeft: "0",
        fontSize: "14px",
        lineHeight: 1.4,
    },
    contactSection: { marginTop: "20px", width: "100%" },
};
