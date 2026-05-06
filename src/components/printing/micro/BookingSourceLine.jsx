export default function BookingSourceLine({ booking, agent }) {
    if (agent) {
        return (
            <p className="sm:text-end text-gray-700">
                Agent:{" "}
                <span
                    className="font-medium truncate p-0 m-0"
                    style={{ maxWidth: "150px", display: "inline-flex" }}
                >
                    {agent.name} {agent.reference}
                </span>
            </p>
        );
    }
    return <p className="sm:text-end text-gray-700">{booking.origin.Label}</p>;
}
