
const InfoDisplay = ({ label, value, className, asHtml, inline }) => {
    if (d === "" || d === null || d === undefined) {
        return null;
    }
    return (
        <div className={inline ? `inline items-center max-w-full gap-1 ${className}` : `flex items-start gap-1 ${className}`}>
            {label && <p className={`font-bold text-gray-900 whitespace-nowrap   ${inline ? "inline mr-1" : ""}`}>{label}</p>}
            {asHtml ? <p dangerouslySetInnerHTML={{ __html: value }} className={inline ? "inline" : ""}></p> : <p className={inline ? "inline" : ""}>{value}</p>}
        </div>
    );
};
export default InfoDisplay