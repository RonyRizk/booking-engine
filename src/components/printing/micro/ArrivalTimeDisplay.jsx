import InfoDisplay from "@/components/InfoDisplay";

export default function ArrivalTimeDisplay({ booking, locales }) {
    return (
        <InfoDisplay
            label={`${locales?.Lcz_ArrivalTime}:`}
            value={booking?.arrival?.description}
        />
    );
}
