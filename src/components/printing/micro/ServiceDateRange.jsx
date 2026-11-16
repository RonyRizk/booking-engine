import InfoDisplay from "@/components/InfoDisplay";
import { getI18n } from "@/lib/printing-i18n";
import DirectionalArrow from "./DirectionalArrow";

export default function ServiceDateRange({ service }) {
    const { formatDate } = getI18n();
    if (!service.start_date && !service.end_date) return null;
    if (service.start_date === service.end_date) {
        return <InfoDisplay
            className="w-fit"
            label=""
            value={formatDate(service.start_date)}
        />
    }
    return (
        <div className="flex items-center">
            {service.start_date && (
                <InfoDisplay
                    className="w-fit"
                    label=""
                    value={formatDate(service.start_date)}
                />
            )}
            {service.end_date && (
                <DirectionalArrow className="mx-1" />
            )}
            {service.end_date && (
                <InfoDisplay
                    label=""
                    value={formatDate(service.end_date)}
                />
            )}
        </div>
    );
}
