import { getI18n } from "@/lib/printing-i18n";
import InfoDisplay from "@/components/InfoDisplay";

export default function OtaRoomMeta({ room }) {
    const { t } = getI18n();
    return (
        <div>
            <InfoDisplay label={`${t("Lcz_MealPlan")}:`} inline value={room?.ota_meta?.meal_plan} />
            <div>
                <InfoDisplay label={`${t("Lcz_Policies")}:`} inline value={room?.ota_meta?.policies} />
            </div>
        </div>
    );
}
