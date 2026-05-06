import InfoDisplay from "@/components/InfoDisplay";

export default function OtaRoomMeta({ room, locales }) {
    return (
        <div>
            <InfoDisplay label={`${locales?.Lcz_MealPlan}:`} inline value={room?.ota_meta?.meal_plan} />
            <div>
                <InfoDisplay label={`${locales?.Lcz_Policies}:`} inline value={room?.ota_meta?.policies} />
            </div>
        </div>
    );
}
