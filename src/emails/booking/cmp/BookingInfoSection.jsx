import { Section, Text } from "@react-email/components";
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
  i18n,
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
          .join(", ").concat(".")}
        {showMapLink && <>
          <EmailLink
            style={{ marginLeft: "8px", marginRight: "8px" }}
            href={`https://www.google.com/maps/preview?q=${property.location.latitude},${property.location.longitude}`}

          >
            {i18n.t("Lcz_Map")}
          </EmailLink>
        </>}
      </EmailText>
      {children}
    </Section>
  );
};

// Contact Information
const ContactInfo = ({ i18n, phone, bookingEmail }) => {
  if (!phone || !bookingEmail) return null;

  return (
    <EmailText style={{ margin: "0" }}>
      <b>{`${i18n.t("Lcz_Phone")}:`}</b> <span dir="ltr">{phone}</span> <br /> <b>{i18n.t("Lcz_Email")}</b>:{" "}
      <EmailLink href={`mailto:${bookingEmail}`}>{bookingEmail}</EmailLink>{" "}
    </EmailText>
  );
};

// GPS Location
const LocationInfo = ({ property, i18n }) => {
  if (!property?.location) return null;

  return (
    <EmailText style={{ marginTop: "0" }}>
      <b>{i18n.t("Lcz_GPS")}:</b> <span dir="ltr">{property.location.latitude},{" "}
        {property.location.longitude}</span>{" "}
      <EmailLink
        href={`https://www.google.com/maps/preview?q=${property.location.latitude},${property.location.longitude}`}
      >
        {i18n.t("Lcz_Map")}
      </EmailLink>
    </EmailText>
  );
};

// Booking Details Section
const BookingDetails = ({ children }) => {
  return <Section>{children}</Section>;
};

// Guest Information
const GuestInfo = ({ booking, i18n }) => {
  const printingService = new PrintingService("");

  return (
    <EmailText style={{ margin: 0 }}>
      <b>{i18n.t("Lcz_BookedBy")}:</b>{" "}
      {printingService.formatGuestName(booking.guest)}
    </EmailText>
  );
};

// Booked On Date
const BookedOnDate = ({ booking, i18n }) => {
  if (!booking.booked_on?.date) return null;

  const format = "ddd, DD MMM YYYY";

  return (
    <EmailText style={{ margin: 0 }}>
      <b>{i18n.t("Lcz_BookedOn")}:</b>{" "}
      {formatDate({
        date: booking.booked_on.date,
        locale: i18n.lang,
        format,
      })}
    </EmailText>
  );
};
const printingService = new PrintingService()
// Guest Phone
const GuestPhone = ({ booking, i18n }) => {
  const phone = printingService.formatPhoneNumber(booking.guest, booking.is_direct)
  if (!phone) {
    return null
  }
  return (
    <EmailText style={{ margin: 0 }}>
      <b>{`${i18n.t("Lcz_Phone")}:`}</b> <span dir="ltr">{phone}</span>
    </EmailText>
  );
};

// Check-in/Check-out Information
const CheckInOutInfo = ({ booking, property, i18n }) => {
  if (!booking.from_date || !booking.to_date) return null;

  const format = "ddd, DD MMM YYYY";

  return (
    <EmailText style={{ margin: 0 }}>
      <b>{`${i18n.t("Lcz_CheckIn")}:`}</b>{" "}
      {formatDate({
        date: booking.from_date,
        locale: i18n.lang,
        format,
      })}{" "}
      {i18n.t("Lcz_From")} {property?.time_constraints?.check_in_from}
      <br />
      <b>{i18n.t("Lcz_CheckOut")}:</b>{" "}
      {formatDate({
        date: booking.to_date,
        locale: i18n.lang,
        format,
      })}{" "}
      {i18n.t("Lcz_Until")} {property?.time_constraints?.check_out_till}
    </EmailText>
  );
};

// Duration Information
const DurationInfo = ({ booking, i18n }) => {
  const roomCount = booking.rooms?.length || 0;
  const totalPersons = booking?.occupancy?.adult_nbr + booking?.occupancy?.children_nbr + booking?.occupancy?.infant_nbr;
  const totalNights = calculateDaysBetweenDates(booking?.from_date, booking?.to_date);
  return (
    <EmailText style={{ margin: 0 }}>
      <b>{i18n.t("Lcz_Duration")}:</b> {totalNights}{" "}
      {i18n.t(totalNights > 1 ? "Lcz_Nights" : "Lcz_Night")} -{" "}
      {totalPersons}{" "}
      {i18n.t(totalPersons > 1 ? "Lcz_Persons" : "Lcz_Person")},{" "}
      {roomCount} {i18n.t(roomCount > 1 ? "Lcz_Rooms" : "Lcz_Room")}
    </EmailText>
  );
};

// Arrival Time
const ArrivalTime = ({ booking, i18n }) => {
  if (!booking.arrival?.description) return null;

  return (
    <EmailText style={{ margin: 0 }}>
      <b>{i18n.t("Lcz_Arrival_Time")}:</b> {booking.arrival.description}
    </EmailText>
  );
};
const TotalPrice = ({ booking, i18n, currency }) => {
  if (booking.financial?.gross_total == null) return null;

  return (
    <EmailText style={{ margin: 0 }}>
      <b>{i18n.t("Lcz_Total_price")}:</b> {formatAmount(booking.financial.gross_total, currency)}
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
