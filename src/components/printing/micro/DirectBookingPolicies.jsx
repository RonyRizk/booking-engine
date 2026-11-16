import InfoDisplay from "@/components/InfoDisplay";
import { getI18n } from "@/lib/printing-i18n";

const sanitizeHtml = str =>
    str.replace("<u>", "").replace("</u>", "").replace("<b>", '<b style="font-weight:bold">');

export default function DirectBookingPolicies({ room }) {
    const { t } = getI18n();
    return (
        <>
            <div>
                <InfoDisplay
                    label={`${t("Lcz_Cancellation")}:`}
                    inline
                    asHtml
                    value={sanitizeHtml(room.rateplan.cancelation)}
                />
            </div>
            <InfoDisplay
                label={`${t("Lcz_Guarantee")}:`}
                asHtml
                inline
                value={sanitizeHtml(room.rateplan.guarantee)}
            />
        </>
    );
}
