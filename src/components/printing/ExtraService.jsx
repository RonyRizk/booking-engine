import InfoDisplay from "@/components/InfoDisplay";
import { format } from "date-fns";
import { formatAmount } from "@/lib/utils";

export default function ExtraService({ service, currency }) {
  return (
    <>
      <div className="flex flex-col sm:items-center sm:flex-row">
        <InfoDisplay
          inline
          label=""
          className="break-words max-w-[90vw] sm:max-w-2xl sm:mr-4"
          value={service.description}
        />
        <div className="flex items-center">
          {(service.start_date || service.end_date) && <span>(</span>}
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
          {(service.start_date || service.end_date) && <span>)</span>}
        </div>
      </div>
      <span className="font-bold">
        {formatAmount(service?.price || 0, currency)}
      </span>
    </>
  );
}
