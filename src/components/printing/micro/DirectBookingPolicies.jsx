import InfoDisplay from "@/components/InfoDisplay";
import { getI18n } from "@/lib/printing-i18n";

const sanitizeHtml = str =>
    str.replace("<u>", "").replace("</u>", "").replace("<b>", '<b style="font-weight:bold">');

/** `withoutCancellation` leaves out the cancellation policy, which states what cancelling costs. */
export default function DirectBookingPolicies({ room, withoutCancellation = false }) {
    const { t } = getI18n();
    return (
        <>
            {!withoutCancellation && (
                <div>
                    <InfoDisplay
                        label={`${t("Lcz_Cancellation")}:`}
                        inline
                        asHtml
                        value={sanitizeHtml(room.rateplan.cancelation)}
                    />
                </div>
            )}
            <InfoDisplay
                label={`${t("Lcz_Guarantee")}:`}
                asHtml
                inline
                value={sanitizeHtml(room.rateplan.guarantee)}
            />
        </>
    );
}
