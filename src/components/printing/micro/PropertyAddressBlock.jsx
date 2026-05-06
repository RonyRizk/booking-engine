import InfoDisplay from "@/components/InfoDisplay";

export default function PropertyAddressBlock({ property, locales }) {
    const address = [property?.address ?? null, property?.city.name ?? null, property?.country.name ?? null]
        .filter(f => f !== null)
        .join(", ");
    return (
        <div>
            <InfoDisplay label={`${locales?.Lcz_Address}:`} value={address} />
            <InfoDisplay
                label={`${locales?.Lcz_Phone}:`}
                value={`+${property?.country?.phone_prefix?.replace("+", "") + " -" || ""} ${property?.phone}`}
            />
        </div>
    );
}
