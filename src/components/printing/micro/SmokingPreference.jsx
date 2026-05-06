import InfoDisplay from "@/components/InfoDisplay";

export default function SmokingPreference({ room, booking, property, locales }) {
    const getSmokingLabel = () => {
        if (booking.is_direct) {
            if (!room.smoking_option) return null;
            const currRT = property.roomtypes.find(rt => rt.id === room.roomtype.id);
            if (currRT) {
                const smokingOptions = currRT['smoking_option']?.allowed_smoking_options;
                if (smokingOptions) return smokingOptions.find(s => s.code === room.smoking_option)?.description;
                return null;
            }
            return null;
        }
        return room.ota_meta?.smoking_preferences;
    };
    return (
        <InfoDisplay label={`${locales?.Lcz_SmokingOptions}:`} inline value={getSmokingLabel()} />
    );
}
