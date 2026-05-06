import { formatAmount } from "@/lib/utils";

export default function DailyRateGrid({ room, currency, printingService, idx, totalRooms }) {
    return (
        <div className={`flex flex-wrap ${idx < totalRooms - 1 ? "pb-4 " : ""}`}>
            {room.days?.map(d => (
                <div className="room_amount_container" key={d.date}>
                    <p className="room_amount date">
                        {printingService.formatDate(d.date, "YYYY-MM-DD")}
                    </p>
                    <div className="room_amount amount pr-1.5">
                        <p>{formatAmount(d.amount, currency)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
