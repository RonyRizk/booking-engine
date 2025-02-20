import InfoDisplay from "@/components/InfoDisplay";

export default function ChannelServices({ booking, locales }) {
    if (!booking.ota_services) return null;

    return (
        <section className="py-4 border-gray-300 border-y border-b-0">
            <p className="text-lg font-semibold text-gray-900 mb-2.5">
                Channel Services
            </p>
            <ul>
                {booking.ota_services?.map((service, idx) => (
                    <li key={"service_" + service.system_id} className={cn({ "pb-4": idx < booking.extra_services.length - 1 })}>
                        <div className="flex items-center gap-1.5 md:gap-4  md:w-max flex-wrap">
                            <InfoDisplay
                                className={""}
                                label={``}
                                value={service.name}
                            />
                            <InfoDisplay
                                label={`Persons:`}
                                value={service.persons}
                            />
                            <InfoDisplay
                                label={`Nights:`}
                                value={service.nights}
                            />
                            <InfoDisplay
                                label={`Total price:`}
                                value={service.total_price}
                            />
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-4  md:w-max flex-wrap">
                            <InfoDisplay
                                className={""}
                                label={`Price mode:`}
                                value={service.price_mode}
                            />
                            <InfoDisplay
                                label={`Price per unit:`}
                                value={service.price_per_unit}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
} 