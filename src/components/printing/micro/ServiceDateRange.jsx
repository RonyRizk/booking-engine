import InfoDisplay from "@/components/InfoDisplay";
import { format } from "date-fns";

export default function ServiceDateRange({ service }) {
    if (!service.start_date && !service.end_date) return null;
    return (
        <div className="flex items-center">
            <span>(</span>
            {service.start_date && (
                <InfoDisplay
                    className="w-fit"
                    label=""
                    value={format(new Date(service.start_date), "eeee, dd MMM yyyy")}
                />
            )}
            {service.end_date && <span className="px-1"> - </span>}
            {service.end_date && (
                <InfoDisplay
                    label=""
                    value={format(new Date(service.end_date), "eeee, dd MMM yyyy")}
                />
            )}
            <span>)</span>
        </div>
    );
}
