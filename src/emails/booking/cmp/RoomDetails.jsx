import { Row, Column } from '@react-email/components';
import { formatAmount } from "@/lib/utils";
import TaxAmount from "./TaxAmount";
import EmailText from '@/emails/components/EmailText';
import { PrintingService } from '@/lib/services/printing.service';

export default function RoomDetails({
  room,
  booking,
  property,
  locales,
  currency,
  lang
}) {
  const printingService = new PrintingService()
  const currRT = property.roomtypes.find(rt => rt.id === room.roomtype.id);
  const currRp = currRT?.rateplans.find(rp => rp.id === room.rateplan.id)
  const custom_text = !!currRp?.custom_text ? `- ${currRp?.custom_text}` : ""
  const getSmokingLabel = () => {
    if (booking.is_direct) {
      if (!room.smoking_option) {
        return null;
      }
      if (currRT) {
        const smoking_option = currRT['smoking_option']?.allowed_smoking_options;
        if (smoking_option) {
          return smoking_option.find(s => s.code === room.smoking_option)?.description;
        }
        return null;
      }
      return null;
    }
    return room.ota_meta?.smoking_preferences;
  }
  return (
    <Row key={room.id} style={{ marginBottom: "15px", width: "100%" }}>
      <Column align={lang === "ar" ? "right" : 'left'} style={{ width: "70%", verticalAlign: 'top', }}>
        <EmailText style={{ margin: 0 }}><b>{room.roomtype.name} - {room.rateplan.short_name} {custom_text}</b> <br /> {room.guest.first_name} - <span dangerouslySetInnerHTML={{ __html: printingService.formatGuestAvailability(room.occupancy, { infant_nbr: room.occupancy.infant_nbr }, locales) }}></span>.
          <br /><i>{locales?.Lcz_Cancellation}: {room.rateplan.cancelation}
            {" "}Guarantee: {room.rateplan.guarantee}</i></EmailText>
      </Column>
      <Column align={lang === "ar" ? "left" : 'right'} style={{ width: "30%", verticalAlign: 'top', }}>
        <EmailText style={{ margin: 0 }}>{formatAmount(room.total, currency)}</EmailText>
        <TaxAmount
          room={room}
          booking={booking}
          property={property}
          locales={locales}
          currency={currency}
        />
      </Column>
    </Row>
  );
}
