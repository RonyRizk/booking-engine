import { Row, Column } from '@react-email/components';
import { formatAmount } from "@/lib/utils";
import TaxAmount from "./TaxAmount";
import EmailText from '@/emails/components/EmailText';
import { PrintingService } from '@/lib/services/printing.service';

const OCCUPANCY_KEYS = ["Lcz_Adult", "Lcz_Adults", "Lcz_Child", "Lcz_Children", "Lcz_Infant", "Lcz_Infants"];

export default function RoomDetails({
  room,
  booking,
  property,
  i18n,
  currency,
}) {
  const { t, dir } = i18n;
  const [alignStart, alignEnd] = dir === "rtl" ? ["right", "left"] : ["left", "right"];
  const occupancyLabels = Object.fromEntries(OCCUPANCY_KEYS.map((key) => [key, t(key)]));
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
  const guest = room.sharing_persons?.find(guest => guest.is_main) || room.guest
  return (
    <Row key={room.id} style={{ marginBottom: "15px", width: "100%" }}>
      <Column align={alignStart} style={{ width: "70%", verticalAlign: 'top', }}>
        <EmailText style={{ margin: 0 }}><b>{room.roomtype.name} - {room.rateplan.short_name} {room.rateplan?.is_non_refundable ? t("Lcz_NonRefundable") : ""} {custom_text}</b> <br /> {printingService.formatGuestName(guest)} - <span dangerouslySetInnerHTML={{ __html: printingService.formatGuestAvailability(room.occupancy, occupancyLabels) }}></span>.
          <br /><i>{t("Lcz_Cancellation")}: {room.rateplan.cancelation}
            {" "}{t("Lcz_Guarantee")}: {room.rateplan.guarantee}</i></EmailText>
      </Column>
      <Column align={alignEnd} style={{ width: "30%", verticalAlign: 'top', textAlign: alignEnd }}>
        <EmailText style={{ margin: 0, textAlign: alignEnd }}>{formatAmount(room.total, currency)}</EmailText>
        <TaxAmount
          room={room}
          booking={booking}
          property={property}
          i18n={i18n}
          currency={currency}
        />
      </Column>
    </Row>
  );
}
