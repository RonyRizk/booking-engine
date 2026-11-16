import React from "react";
import { bookingData as data } from "./data/booking";
import BookingEmail from "../booking";
import { createLabels, EMAIL_LABELS } from "@/lib/labels";

export default function BookingPreview() {
    return (
        <BookingEmail {...data} i18n={createLabels(EMAIL_LABELS, data.lang, { entries: data.locales })} />
    );
}

