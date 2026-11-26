import React from 'react'
import EmailContainer from '../components/EmailContainer'
import PropertyHeader from '../components/PropertyHeader'
import EmailText from '../components/EmailText'
import EmailButton from '../components/EmailButton'
import EmailFooter from '../components/EmailFooter'
import GuestServiceContactUs from './cmp/GuestServiceContactUs'
import { formatGuestName } from '../utils'
import { formatAmount } from '@/lib/utils'
import { siteUrl } from '@/lib/app-env'

export default function PaymentReminderEmail({ booking, property, i18n, dueAmount }) {
    const { t, lang, dir } = i18n;
    const paymentUrl = `${siteUrl(property.perma_link, '/booked')}?b=${booking.booking_nbr}&e=${encodeURIComponent(booking.guest?.email ?? '')}&lang=${lang}&mode=payment&due_amount=${dueAmount}`
    return (
        <EmailContainer lang={lang} dir={dir} connectedMpo={property.mpo}>
            <PropertyHeader property={property} />
            <EmailText>
                {t("Lcz_DearX", formatGuestName(booking.guest))}
            </EmailText>
            <EmailText>
                {t("Lcz_PaymentReminderDue", formatAmount(dueAmount, property.currency?.symbol), property.name)}
            </EmailText>
            <EmailButton dir={dir} href={paymentUrl}>
                {t("Lcz_SignInToYourAccount")}
            </EmailButton>
            <EmailFooter>
                <EmailText style={styles.contactText} dangerouslySetInnerHTML={{ __html: property.description?.important_info }} />
                <GuestServiceContactUs property={property} i18n={i18n} manageBookingShown={false} />
                <EmailText>
                    {t("Lcz_Look_forward")} {property.name}
                </EmailText>
            </EmailFooter>
        </EmailContainer>
    )
}
const styles = {
    contactText: { width: "100%" },
}
