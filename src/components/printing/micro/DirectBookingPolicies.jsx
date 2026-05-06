import InfoDisplay from "@/components/InfoDisplay";

const sanitizeHtml = str =>
    str.replace("<u>", "").replace("</u>", "").replace("<b>", '<b style="font-weight:bold">');

export default function DirectBookingPolicies({ room }) {
    return (
        <>
            <div>
                <InfoDisplay
                    label={"Cancellation:"}
                    inline
                    asHtml
                    value={sanitizeHtml(room.rateplan.cancelation)}
                />
            </div>
            <InfoDisplay
                label={"Guarantee:"}
                asHtml
                inline
                value={sanitizeHtml(room.rateplan.guarantee)}
            />
        </>
    );
}
