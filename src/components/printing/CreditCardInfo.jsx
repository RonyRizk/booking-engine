import InfoDisplay from "../InfoDisplay";


export default async function CreditCardInfo({ booking, printingService }) {
    const isDirect = booking.is_direct;
    const guestCCI = booking.guest?.cci;

    if (isDirect) {
        if (!guestCCI) {
            return null;
        }
        return (
            <section className="border-b pb-2.5">
                <p className="text-lg font-semibold mb-4 text-gray-900">Card Details</p>
                <InfoDisplay label="Name:" value={guestCCI.holder_name} />
                <InfoDisplay label="Number:" value={guestCCI.nbr} />
                <InfoDisplay label="Expiry:" value={`${guestCCI.expiry_month}/${guestCCI.expiry_year}`} />
            </section>
        );
    }

    try {
        const url = await printingService.getPCICardInfoURL(booking.booking_nbr);
        if (url) {
            return (<section className="border-b pb-2.5">
                <p className="text-lg font-semibold mb-4 text-gray-900">Card Details</p>
                <iframe src={url} width="100%" className="h-60" title="Secure card details" />
            </section>)
        }
    } catch (error) {
        console.error(error);
    }

    const { ota_guarante: ota } = booking;
    if (!ota) {
        return null;
    }

    return (
        <section className="border-b pb-2.5">
            <p className="text-lg font-semibold mb-4 text-gray-900">Card Details</p>
            <InfoDisplay value={`${ota.card_type}${ota.is_virtual ? " (virtual)" : ""}`} label="Type:" />
            <InfoDisplay value={ota.cardholder_name} label="Name:" />
            <InfoDisplay value={ota.card_number} label="Number:" />
        </section>
    );
}
