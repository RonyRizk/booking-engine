import { cn } from "@/lib/utils";

const InfoDisplay = ({ label, value, className, asHtml, inline }) => {
    if (value === "" || value === null || value === undefined) {
        return null;
    }
    return (
        <div className={cn("gap-1", {
            "inline items-center max-w-full": inline,
            "flex items-start": !inline,
        }, className)
        }>
            {label && <p className={`font-bold text-gray-900 whitespace-nowrap   ${inline ? "inline mr-1" : ""}`}>{label}</p>}
            {asHtml ? <p dangerouslySetInnerHTML={{ __html: value }} className={inline ? "inline font-normal" : "font-normal"}></p> : <p className={inline ? "inline font-normal" : "font-normal"}>{value}</p>}
        </div>
    );
};
export default InfoDisplay
