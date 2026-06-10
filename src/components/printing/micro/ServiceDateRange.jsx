import InfoDisplay from "@/components/InfoDisplay";
import moment from "moment";

export default function ServiceDateRange({ service }) {
    if (!service.start_date && !service.end_date) return null;
    return (
        <div className="flex items-center">
            <span>(</span>
            {service.start_date && (
                <InfoDisplay
                    className="w-fit"
                    label=""
                    value={moment(service.start_date).locale("en").format("dddd, DD MMM YYYY")}
                />
            )}
            {service.end_date && <span className="px-1"> - </span>}
            {service.end_date && (
                <InfoDisplay
                    label=""
                    value={moment(service.end_date).locale("en").format("dddd, DD MMM YYYY")}
                />
            )}
            <span>)</span>
        </div>
    );
}
