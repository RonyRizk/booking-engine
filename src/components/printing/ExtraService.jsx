import InfoDisplay from "@/components/InfoDisplay";
import { getI18n } from "@/lib/printing-i18n";
import { formatAmount } from "@/lib/utils";

export default function ExtraService({ service, currency }) {
  const { formatDate } = getI18n();
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
              value={formatDate(service.start_date, "full")}
            />
          )}
          {service.end_date && <span className="px-1"> - </span>}
          {service.end_date && (
            <InfoDisplay
              label=""
              value={formatDate(service.end_date, "full")}
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
