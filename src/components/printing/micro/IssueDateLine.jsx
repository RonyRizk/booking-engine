import InfoDisplay from "@/components/InfoDisplay";
import moment from "moment";

export default function IssueDateLine({ mode, selectedDocument }) {
    const date = mode === "receipt"
        ? moment().locale('en').format('MMMM, DD YYYY')
        : moment(selectedDocument.date, 'YYYY-MM-DD').locale('en').format('MMMM, DD YYYY');
    return <InfoDisplay className={""} label={"Date of issue:"} value={date} />;
}
