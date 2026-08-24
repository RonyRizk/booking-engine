import InfoDisplay from "@/components/InfoDisplay";
import moment from "moment";

export default function ServiceDateRange({ service }) {
    if (!service.start_date && !service.end_date) return null;
    if (service.start_date === service.end_date) {
        return <InfoDisplay
            className="w-fit"
            label=""
            value={moment(service.start_date).locale("en").format("MMM DD, YYYY")}
        />
    }
    return (
        <div className="flex items-center">
            {service.start_date && (
                <InfoDisplay
                    className="w-fit"
                    label=""
                    value={moment(service.start_date).locale("en").format("MMM DD, YYYY")}
                />
            )}
            {service.end_date && (
                <svg className="mx-1" xmlns="http://www.w3.org/2000/svg" height={12} width={12} viewBox="0 0 640 640">
                    <path fill="currentColor" d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
                </svg>
            )}
            {service.end_date && (
                <InfoDisplay
                    label=""
                    value={moment(service.end_date).locale("en").format("MMM DD, YYYY")}
                />
            )}
        </div>
    );
}
