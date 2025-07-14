import { Section } from "@react-email/components";
import EmailText from "@/emails/components/EmailText";
import EmailLink from "@/emails/components/EmailLink";
import { PrintingService } from "@/lib/services/printing.service";
import { formatDate } from "@/emails/utils";
import { calculateDaysBetweenDates, formatAmount } from "@/lib/utils";

// Main container component
const BookingInfoSection = ({ children }) => {
  return <>{children}</>;
};

// Property Details Section
const PropertyDetails = ({
  property,
  locales,
  showMapLink = true,
  children,
}) => {
  return (
    <Section>
      <EmailText style={{ margin: "0" }}>
        {[
          property?.address ?? null,
          property?.city?.name ?? null,
          property?.country?.name ?? null,
        ]
          .filter(Boolean)
          .join(", ")}
        {showMapLink && <>
          {" "}
          <EmailLink
            href={`https://www.google.com/maps/preview?q=${property.location.latitude},${property.location.longitude}`}
          >
            {locales?.Lcz_Map}
          </EmailLink>
        </>}
      </EmailText>
      {children}
    </Section>
  );
};

// Contact Information
const ContactInfo = ({ locales, phone, bookingEmail }) => {
  if (!phone || !bookingEmail) return null;

  return (
    <EmailText style={{ margin: "0" }}>
      <b>{`${locales?.Lcz_Phone}:`}</b> {phone} <br /> <b>{locales.Lcz_Email}</b>:{" "}
      <EmailLink href={`mailto:${bookingEmail}`}>{bookingEmail}</EmailLink>{" "}
    </EmailText>
  );
};

// GPS Location
const LocationInfo = ({ property, locales }) => {
  if (!property?.location) return null;

  return (
    <EmailText style={{ marginTop: "0" }}>
      <b>{locales?.Lcz_GPS}:</b> {property.location.latitude},{" "}
      {property.location.longitude}{" "}
      <EmailLink
        href={`https://www.google.com/maps/preview?q=${property.location.latitude},${property.location.longitude}`}
      >
        {locales?.Lcz_Map}
      </EmailLink>
    </EmailText>
  );
};

// Booking Details Section
const BookingDetails = ({ children }) => {
  return <Section>{children}</Section>;
};

// Guest Information
const GuestInfo = ({ booking, locales }) => {
  const printingService = new PrintingService("");

  return (
    <EmailText style={{ margin: 0 }}>
      <b>{locales?.Lcz_BookedBy}:</b>{" "}
      {printingService.formatGuestName(booking.guest)}
    </EmailText>
  );
};

// Booked On Date
const BookedOnDate = ({ booking, locales, lang = "en" }) => {
  if (!booking.booked_on?.date) return null;

  const format = "ddd, DD MMM YYYY";

  return (
    <EmailText style={{ margin: 0 }}>
      <b>{locales?.Lcz_BookedOn}:</b>{" "}
      {formatDate({
        date: booking.booked_on.date,
        locale: lang,
        format,
      })}
    </EmailText>
  );
};
const printingService = new PrintingService()
// Guest Phone
const GuestPhone = ({ booking, locales }) => {
  const phone = printingService.formatPhoneNumber(booking.guest, booking.is_direct)
  return (
    <EmailText style={{ margin: 0 }}>
      <b>{`${locales?.Lcz_Phone}:`}</b> {phone}
    </EmailText>
  );
};

// Check-in/Check-out Information
const CheckInOutInfo = ({ booking, property, locales, lang = "en" }) => {
  if (!booking.from_date || !booking.to_date) return null;

  const format = "ddd, DD MMM YYYY";

  return (
    <EmailText style={{ margin: 0 }}>
      <b>{`${locales?.Lcz_CheckIn}:`}</b>{" "}
      {formatDate({
        date: booking.from_date,
        locale: lang,
        format,
      })}{" "}
      {locales?.Lcz_From} {property?.time_constraints?.check_in_from}
      <br />
      <b>{locales?.Lcz_CheckOut}:</b>{" "}
      {formatDate({
        date: booking.to_date,
        locale: lang,
        format,
      })}{" "}
      {locales?.Lcz_Until} {property?.time_constraints?.check_out_till}
    </EmailText>
  );
};

// Duration Information
const DurationInfo = ({ booking, locales, }) => {
  const roomCount = booking.rooms?.length || 0;
  const totalPersons = booking?.occupancy?.adult_nbr + booking?.occupancy?.children_nbr + booking?.occupancy?.infant_nbr;
  const totalNights = calculateDaysBetweenDates(booking?.from_date, booking?.to_date);
  return (
    <EmailText style={{ margin: 0 }}>
      <b>{locales?.Lcz_Duration}:</b> {totalNights}{" "}
      {totalNights > 1 ? locales?.Lcz_Nights : locales?.Lcz_Night} -{" "}
      {totalPersons}{" "}
      {totalPersons > 1 ? locales?.Lcz_Persons : locales?.Lcz_Person},{" "}
      {roomCount} {roomCount > 1 ? locales?.Lcz_Rooms : locales?.Lcz_Room}
    </EmailText>
  );
};

// Arrival Time
const ArrivalTime = ({ booking, locales }) => {
  if (!booking.arrival?.description) return null;

  return (
    <EmailText style={{ margin: 0 }}>
      <b>{locales?.Lcz_Arrival_Time}:</b> {booking.arrival.description}
    </EmailText>
  );
};
const TotalPrice = ({ booking, locales, currency }) => {
  if (!booking.arrival?.description) return null;

  return (
    <EmailText style={{ margin: 0 }}>
      <b>{locales?.Lcz_Total_price}:</b> {formatAmount(booking.financial.gross_total, currency)}
    </EmailText>
  );
};
//* WRAPPERS *//
// Conditional wrapper for direct bookings
const DirectBookingOnly = ({ booking, children }) => {
  if (!booking.is_direct) return null;
  return <>{children}</>;
};

// Conditional wrapper for non-cancelled bookings
const NonCancelledOnly = ({ booking, children }) => {
  if (booking.status.code === "003") return null;
  return <>{children}</>;
};

// Conditional wrapper for non-direct bookings
const NonDirectOnly = ({ booking, children }) => {
  if (booking.is_direct) return null;
  return <>{children}</>;
};

// Conditional wrapper for cancelled bookings
const CancelledOnly = ({ booking, children }) => {
  if (booking.status.code !== "003") return null;
  return <>{children}</>;
};

// Export all components
BookingInfoSection.PropertyDetails = PropertyDetails;
BookingInfoSection.ContactInfo = ContactInfo;
BookingInfoSection.LocationInfo = LocationInfo;
BookingInfoSection.BookingDetails = BookingDetails;
BookingInfoSection.GuestInfo = GuestInfo;
BookingInfoSection.BookedOnDate = BookedOnDate;
BookingInfoSection.GuestPhone = GuestPhone;
BookingInfoSection.CheckInOutInfo = CheckInOutInfo;
BookingInfoSection.DurationInfo = DurationInfo;
BookingInfoSection.ArrivalTime = ArrivalTime;
BookingInfoSection.TotalPrice = TotalPrice;

BookingInfoSection.DirectBookingOnly = DirectBookingOnly;
BookingInfoSection.NonCancelledOnly = NonCancelledOnly;
BookingInfoSection.NonDirectOnly = NonDirectOnly;
BookingInfoSection.CancelledOnly = CancelledOnly;

export default BookingInfoSection;
