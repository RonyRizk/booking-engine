import InfoDisplay from "@/components/InfoDisplay";

export default function GuestContactDetails({ booking, guestCountryName, printingService }) {
    return (
        <>
            <InfoDisplay label={`Email:`} value={booking?.guest?.email} />
            <InfoDisplay
                label={`Phone:`}
                value={printingService.formatPhoneNumber(booking?.guest, booking?.is_direct)}
            />
            {guestCountryName && <InfoDisplay label={`Country:`} value={guestCountryName} />}
        </>
    );
}
