import InfoDisplay from "@/components/InfoDisplay";
import { getI18n } from "@/lib/printing-i18n";

export default function CompanyBillToBlock({ booking }) {
    return (
        <section className="justify-start flex flex-col">
            <h3 className="font-bold">{getI18n().t("Lcz_BillTo")}</h3>
            <div>
                <InfoDisplay label={``} value={booking?.company_name} />
                <InfoDisplay label={``} value={booking?.company_tax_nbr} />
            </div>
        </section>
    );
}
