import { NextRequest } from "next/server";
import { installFakeGateway } from "@/test/helpers/fake-gateway";

/**
 * Answers the gateway calls an email route makes with `booking` and `property`.
 *
 * @param {{ booking?: object, property?: object, labels?: object, results?: Record<string, unknown> }} options
 */
export const installEmailGateway = ({ booking, property, labels, results = {} } = {}) =>
    installFakeGateway({
        "/Get_Exposed_Booking": booking,
        "/Get_Exposed_Property": property,
        "/Get_Exposed_Countries": [],
        "/Get_Exposed_Language": labels,
        ...results,
    });

/** A request to an email route, authenticated and with `query` as its search params. */
export const emailRequest = (path, query = {}, { body, headers = {} } = {}) =>
    new NextRequest(`http://localhost/api/email/${path}?${new URLSearchParams(query)}`, {
        method: body ? "POST" : "GET",
        headers: { Authorization: "token", ...headers },
        body: body ? JSON.stringify(body) : undefined,
    });
