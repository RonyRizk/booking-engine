import InfoDisplay from "@/components/InfoDisplay";

export default function CompanyBillToBlock({ booking }) {
    return (
        <section className="justify-start flex flex-col">
            <h3 className="font-bold">Bill to</h3>
            <div>
                <InfoDisplay label={``} value={booking?.company_name} />
                <InfoDisplay label={``} value={booking?.company_tax_nbr} />
            </div>
        </section>
    );
}
