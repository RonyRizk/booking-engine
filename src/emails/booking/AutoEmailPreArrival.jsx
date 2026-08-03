import React from 'react'
import EmailContainer from '../components/EmailContainer'
import PropertyHeader from '../components/PropertyHeader'
import EmailText from '../components/EmailText'
import { formatGuestName } from '../utils'
import GuestServiceContactUs from '../booking/cmp/GuestServiceContactUs'
import EmailFooter from '../components/EmailFooter'

/**
 * Builds the guest access code: prefix + the last N digits of the booking number + suffix.
 *
 * @param {string|number} bookingNbr
 * @param {{ACCESS_CODE_PREFIX?: string|null, ACCESS_CODE_SUFFIX?: string|null, ACCESS_CODE?: string|null}} accessCode
 * @returns {string}
 */
function buildAccessCode(bookingNbr, accessCode) {
    const nbr = String(bookingNbr ?? '');
    const length = Number(accessCode.ACCESS_CODE);
    const digits = Number.isFinite(length) && length > 0 ? nbr.slice(-length) : nbr;
    return `${accessCode.ACCESS_CODE_PREFIX ?? ''}${digits}${accessCode.ACCESS_CODE_SUFFIX ?? ''}`;
}

export default function AutoEmailPreArrival({ booking, setupTables, lang, locales, property, accessCode }) {
    const preTableEntries = setupTables["_PRE_ARRIVAL_EMAIL"]
    const duration = property?.extra_info?.find(e => e.key === "EMAIL_PRE_ARRIVAL_DAYS_BEFORE_CHECK_IN")?.value ?? "";
    const description = property?.extra_info?.find(e => e.key === "EMAIL_PRE_ARRIVAL_CUSTOM_MESSAGE")?.value ?? "";
    const showAccessCode = Number(accessCode?.ALLOW_ACCESS_CODE) === 1;
    return (
        <EmailContainer lang={lang} connectedMpo={property.mpo}>
            <PropertyHeader property={property} />
            <EmailText>
                {preTableEntries.ENTRY_01.replace('[GUEST_NAME]', formatGuestName(booking.guest))}
            </EmailText>
            <EmailText>
                {preTableEntries.ENTRY_02.replace('[PROPERTY_NAME]', property.name).replace('[DAYS]', duration)}
            </EmailText>
            <EmailText dangerouslySetInnerHTML={{ __html: description }} />
            {showAccessCode && (
                <>
                    <EmailText style={{ marginBottom: "0", fontWeight: "bold" }}>
                        Your access code{(booking.rooms ?? [])?.length > 1 ? "s" : ""}:
                    </EmailText>
                    {booking.rooms?.map(r => <EmailText style={{ marginBottom: "0" }} key={r.identifier}>
                        {r.roomtype.name}{r.unit ? ` ${r.unit.name}` : ""}: {buildAccessCode(booking.booking_nbr, accessCode)}
                    </EmailText>)}
                </>
            )}
            <EmailFooter>
                <EmailText>
                    {preTableEntries.ENTRY_06.replace('[BOOK_NBR]', booking.booking_nbr)}
                </EmailText>
                <GuestServiceContactUs property={property} locales={locales} />
                <EmailText>
                    {preTableEntries.ENTRY_05},<br />
                    {property.name}
                </EmailText>
            </EmailFooter>
        </EmailContainer>
    )
}
