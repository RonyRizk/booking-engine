import { Container, Section } from '@react-email/components';
import EmailText from '@/emails/components/EmailText';
import PropertyHeader from '@/emails/components/PropertyHeader';
import BookingInfoSection from './BookingInfoSection';

export default function BookingHeader({
    booking,
    lang = "en",
    property,
    locales,
    bookingEmail,
    phone,
    requestedCancellation
}) {
    const isCancelled = booking.status.code === "003";
    const isDirect = booking.is_direct;
    const _baseProps = { booking, locales }
    return (
        <Container style={styles.container}>
            <PropertyHeader property={property}>
                {requestedCancellation && (
                    <EmailText variant='title' color='red'>
                        Request email cancellation
                    </EmailText>
                )}
            </PropertyHeader>

            <Section>
                <EmailText
                    variant='title'
                    color={isCancelled && "red"}
                    style={{
                        marginTop: '0',
                        padding: 0
                    }}
                >
                    {isCancelled ? locales?.Lcz_CancellationForBooking : locales?.Lcz_BookingNb} {isDirect ? booking.booking_nbr : booking.channel_booking_nbr}
                </EmailText>
            </Section>

            <EmailText style={{ margin: "0" }}>
                <b>{property.name}</b>
            </EmailText>

            <BookingInfoSection.BookingDetails>
                <BookingInfoSection.NonCancelledOnly booking={booking}>
                    <BookingInfoSection.DirectBookingOnly booking={booking}>
                        <BookingInfoSection.PropertyDetails property={property} locales={locales} />
                        <BookingInfoSection.ContactInfo property={property} phone={phone} locales={locales} bookingEmail={bookingEmail} />
                        {/* <BookingInfoSection.LocationInfo property={property} locales={locales} /> */}
                    </BookingInfoSection.DirectBookingOnly>
                </BookingInfoSection.NonCancelledOnly>
                <EmailText></EmailText>
                <BookingInfoSection.GuestInfo {..._baseProps} />
                <BookingInfoSection.NonDirectOnly booking={booking}>
                    <BookingInfoSection.BookedOnDate {..._baseProps} />
                </BookingInfoSection.NonDirectOnly>
                <BookingInfoSection.NonCancelledOnly booking={booking}>
                    <BookingInfoSection.DirectBookingOnly booking={booking}>
                        <BookingInfoSection.GuestPhone {..._baseProps} />
                        <BookingInfoSection.CheckInOutInfo {..._baseProps} property={property} />
                    </BookingInfoSection.DirectBookingOnly>
                </BookingInfoSection.NonCancelledOnly>
                <BookingInfoSection.DurationInfo {..._baseProps} />
                <BookingInfoSection.NonCancelledOnly booking={booking}>
                    <BookingInfoSection.DirectBookingOnly booking={booking}>
                        <BookingInfoSection.ArrivalTime {..._baseProps} />
                    </BookingInfoSection.DirectBookingOnly>
                </BookingInfoSection.NonCancelledOnly>
            </BookingInfoSection.BookingDetails>
        </Container>
    );
}

const styles = {
    container: {
        width: '100%',
        margin: '0',
        padding: '0',
    },
};
// import { Container, Section } from '@react-email/components';
// import EmailText from '@/emails/components/EmailText';
// import EmailLink from '@/emails/components/EmailLink';
// import { PrintingService } from '@/lib/services/printing.service';
// import { formatDate } from '@/emails/utils';
// import PropertyHeader from '@/emails/components/PropertyHeader';


// export default function BookingHeader({ booking, lang = "en", property, locales, totalPersons, totalNights, bookingEmail, phone, requestedCancellation }) {
//     const printingService = new PrintingService("");
//     const isCancelled = booking.status.code === "003";
//     const isDirect = booking.is_direct;
//     const format = 'ddd, DD MMM YYYY'
//     return (
//         <Container style={styles.container}>
//             <PropertyHeader property={property}>
//                 {requestedCancellation && <EmailText variant='title' color='red'>Request email cancellation</EmailText>}
//             </PropertyHeader>

//             <Section>
//                 <EmailText variant='title' color={isCancelled && "red"} style={{
//                     marginTop: '0',
//                     padding: 0
//                 }}>{isCancelled ? locales?.Lcz_CancellationForBooking : locales?.Lcz_BookingNb} {isDirect ? booking.booking_nbr : booking.channel_booking_nbr}</EmailText>
//             </Section>
//             <EmailText style={{ margin: "0" }}><b>{property.name}</b></EmailText>
//             {!isCancelled && isDirect && <Section>
//                 <EmailText style={{ margin: "0" }}>  {[
//                     property?.address ?? null,
//                     property?.city.name ?? null,
//                     property?.country.name ?? null,
//                 ]
//                     .filter((f) => f !== null)
//                     .join(", ")}</EmailText>
//                 <EmailText style={{ margin: "0" }}><b>{`${locales?.Lcz_Phone}:`}</b> {phone} - {locales.Lcz_Email}: <EmailLink href={`mailto:${bookingEmail}`}>{bookingEmail}</EmailLink> </EmailText>
//                 <EmailText style={{ marginTop: "0" }}><b>{locales?.Lcz_GPS}:</b> {property.location.latitude}, {property.location.longitude} <EmailLink href={`https://www.google.com/maps/preview?q=${property.location.latitude},${property.location.longitude}`}>{locales?.Lcz_Map}</EmailLink> </EmailText>
//             </Section>}
//             <Section>
//                 <EmailText style={{ margin: 0 }}><b>{locales?.Lcz_BookedBy}:</b> {printingService.formatGuestName(booking.guest)} </EmailText>
//                 {!isDirect && <EmailText style={{ margin: 0 }}><b>{locales?.Lcz_BookedOn}:</b> {formatDate({ date: booking.booked_on.date, locale: lang, format })} </EmailText>}
//                 {!isCancelled && <>
//                     {isDirect && <EmailText style={{ margin: 0 }}><b>{`${locales?.Lcz_Phone}:`}</b> {booking.guest.country_phone_prefix} - {booking.guest.mobile_without_prefix}</EmailText>}
//                     <EmailText style={{ margin: 0 }}><b>{`${locales?.Lcz_CheckIn}:`}</b> {formatDate({ date: booking.from_date, locale: lang, format })} {locales?.Lcz_From} {property.time_constraints.check_in_from}<br />
//                         <b>{locales?.Lcz_CheckOut}:</b> {formatDate({ date: booking.to_date, locale: lang, format })} {locales?.Lcz_Until} {property.time_constraints.check_out_till}</EmailText>
//                 </>}
//                 <EmailText style={{ margin: 0 }}><b>{locales?.Lcz_Duration}:</b> {totalNights} {totalNights > 1 ? locales?.Lcz_Nights : locales?.Lcz_Night} - {totalPersons} {totalPersons > 1 ? locales?.Lcz_Persons : locales?.Lcz_Person}, {booking.rooms.length} {booking.rooms.length > 1 ? locales?.Lcz_Rooms : locales?.Lcz_Room} </EmailText>
//                 {booking.arrival && isDirect && !isCancelled && <EmailText style={{ margin: 0 }}><b>{locales?.Lcz_Arrival_Time}:</b> {booking.arrival.description} </EmailText>}
//             </Section>
//         </Container>
//     );
// }

// const styles = {
//     container: {
//         width: '100%',
//         margin: '0',
//         padding: '0',
//     },
// };
