import { formatAmount } from "@/lib/utils";
import { getI18n } from "@/lib/printing-i18n";

// Punctuation and spaces are about half a digit wide, capitals a bit wider.
const NARROW = new Set([" ", ",", ".", ":", "/", "'", "-"]);

/** Roughly how wide `text` renders, in `ch` (the width of a digit). */
function textWidthCh(text) {
    let width = 0;
    for (const char of text) {
        if (NARROW.has(char)) width += 0.5;
        else if (char >= "A" && char <= "Z") width += 1.25;
        else width += 1;
    }
    return width;
}

export default function DailyRateGrid({ room, currency, idx, totalRooms }) {
    const { formatDate } = getI18n();
    const nights = (room.days ?? []).map((d) => ({
        key: d.date,
        date: formatDate(d.date, "dayMonth"),
        amount: formatAmount(d.amount, currency),
    }));
    // Every column is as wide as the room's widest date or amount plus the cells'
    // inline padding, so the nights line up in columns while taking no more room
    // than their text; how many fit on a line follows the page width.
    const widest = Math.max(0, ...nights.flatMap((n) => [textWidthCh(n.date), textWidthCh(n.amount)]));

    return (
        // Columns are 1.5 apart so the date bands don't run together; rows are spaced
        // by the amount's bottom margin (.room_amount.amount).
        <div
            className={`grid gap-x-1.5 ${idx < totalRooms - 1 ? "pb-4 " : ""}`}
            style={{ gridTemplateColumns: `repeat(auto-fill, calc(${widest}ch + 0.75rem))` }}
        >
            {nights.map((n) => (
                <div className="room_amount_container" key={n.key}>
                    <p className="room_amount date px-1.5 py-0.5">{n.date}</p>
                    <div className="room_amount amount px-1.5 pt-0.5">
                        <p>{n.amount}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
