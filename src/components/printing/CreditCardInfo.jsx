import InfoDisplay from "../InfoDisplay";
import { getI18n } from "@/lib/printing-i18n";


export default async function CreditCardInfo({ booking, printingService }) {
    const { t } = getI18n();
    const isDirect = booking.is_direct;
    const guestCCI = booking.guest?.cci;

    if (isDirect) {
        if (!guestCCI) {
            return null;
        }
        return (
            <section className="border-b pb-2.5">
                <p className="text-lg font-semibold mb-4 text-gray-900">{t("Lcz_CardDetails")}</p>
                <InfoDisplay label={`${t("Lcz_Name")}:`} value={guestCCI.holder_name} />
                <InfoDisplay label={`${t("Lcz_Number")}:`} value={guestCCI.nbr} />
                <InfoDisplay label={`${t("Lcz_Expiry")}:`} value={`${guestCCI.expiry_month}/${guestCCI.expiry_year}`} />
            </section>
        );
    }

    // try {
    //     const url = await printingService.getPCICardInfoURL(booking.booking_nbr);
    //     if (url) {
    //         return (<section className="border-b pb-2.5">
    //             <p className="text-lg font-semibold mb-4 text-gray-900">Card Details</p>
    //             <iframe src={url} width="100%" className="h-60" title="Secure card details" />
    //         </section>)
    //     }
    // } catch (error) {
    //     console.error(error);
    // }

    const { ota_guarante: ota } = booking;
    if (!ota) {
        return null;
    }

    return (
        <section className="border-b pb-2.5">
            <p className="text-lg font-semibold mb-4 text-gray-900">{t("Lcz_CardDetails")}</p>
            <InfoDisplay value={ota.is_virtual ? t("Lcz_X_Virtual", ota.card_type) : ota.card_type} label={`${t("Lcz_Type")}:`} />
            <InfoDisplay value={ota.cardholder_name} label={`${t("Lcz_Name")}:`} />
            <InfoDisplay value={ota.card_number} label={`${t("Lcz_Number")}:`} />
        </section>
    );
}
