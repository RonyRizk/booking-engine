import React from "react";
import { bookingData as data } from "./data/booking";
import BookingEmail from "../booking";

export default function BookingPreview() {
    return (
        <BookingEmail {...data} />
    );
}

