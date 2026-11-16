import React from "react";
import EmailContainer from "../components/EmailContainer";
import BookingHeader from "./cmp/BookingHeader";
import EmailText from "../components/EmailText";
import GuestServiceContactUs from "./cmp/GuestServiceContactUs";
import BookingDetails from "./cmp/BookingDetails";
import EmailFooter from "../components/EmailFooter";
import { formatAmount } from "@/lib/utils";

export default function BookingEmail({
    i18n,
    totalPersons,
    booking,
    currency,
    totalNights,
    property,
    phone,
    bookingEmail,
}) {
    const { t, lang, dir } = i18n;
    const prepaymentCode = booking.extras?.find(
        (e) => e.key === "payment_code"
    )?.value;
    const totalCollected = booking?.guest_financial?.collected || 0
    const dueAmount = booking?.guest_financial?.due_amount || 0
    const getPaymentMessage = () => {
        if (totalCollected > 0) {
            return `<div>
                        <p>${t("Lcz_Paid")}: ${formatAmount(totalCollected, booking?.currency?.symbol)}</p>
                        <p>${t("Lcz_Due")}: ${formatAmount(dueAmount, booking?.currency?.symbol)}</p>
                    </div>`
        }
        switch (prepaymentCode) {
            case "001":
                return `<p>${t("Lcz_Payment_OfflineCreditCard")}</p>`;
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
                let enSelectedLocalizable = method.localizables?.find(
                    (l) => l.language.code.toLowerCase() === "en"
                );
                if (!selectedLocalizable?.description) {
                    return enSelectedLocalizable?.description?.replace(
                        /<p>/g,
                        '<p style="margin:0;padding:0;">'
                    )
                }
                return selectedLocalizable?.description?.replace(
                    /<p>/g,
                    '<p style="margin:0;padding:0;">'
                );
            default:
                return `<p>${t("Lcz_Payment_NotFullyPaid")}</p>`;
                ;
        }
    };

    return (
        <EmailContainer lang={lang} dir={dir} connectedMpo={property.mpo}>
            <BookingHeader
                bookingEmail={bookingEmail}
                totalPersons={totalPersons}
                totalNights={totalNights}
                requestedCancellation={booking.is_requested_to_cancel}
                phone={phone}
                booking={booking}
                property={property}
                i18n={i18n}
                mode={"printing"}
            />
            <EmailText variant="subtitle">{t("Lcz_Booking_details")}</EmailText>
            <BookingDetails booking={booking} property={property} i18n={i18n} currency={currency} />
            <EmailText variant="subtitle">{t("Lcz_PaymentDetails")}</EmailText>
            <EmailText>{t(property.is_upon_request && booking?.status?.code === "001" ? "Lcz_YourBookingIsNotGuaranteed" : "Lcz_YourBookingIsGuaranteed")}</EmailText>
            <div
                style={styles.paymentMessage}
                dangerouslySetInnerHTML={{ __html: getPaymentMessage() }}
            ></div>

            <EmailFooter>
                <EmailText style={styles.contactText} dangerouslySetInnerHTML={{ __html: property.description.important_info }} />
                <GuestServiceContactUs property={property} i18n={i18n} />
                <EmailText>
                    {t("Lcz_Look_forward")} {property.name}
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
