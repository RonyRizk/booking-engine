import InfoDisplay from "@/components/InfoDisplay";
import { getI18n } from "@/lib/printing-i18n";

export default function GuestContactDetails({ booking, guestCountryName, printingService }) {
    const { t } = getI18n();
    return (
        <>
            <InfoDisplay label={`${t("Lcz_Email")}:`} value={booking?.guest?.email} />
            <InfoDisplay
                label={`${t("Lcz_Phone")}:`}
                value={printingService.formatPhoneNumber(booking?.guest, booking?.is_direct)}
            />
            {guestCountryName && <InfoDisplay label={`${t("Lcz_Country")}:`} value={guestCountryName} />}
        </>
    );
}
