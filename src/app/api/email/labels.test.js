import { afterEach, describe, expect, test } from "bun:test";
import * as bookingRoute from "./booking/route";
import * as cancellationRoute from "./booking/cancellation/route";
import * as requestCancellationRoute from "./booking/request-cancellation/route";
import * as chmRoute from "./booking/chm/route";
import * as autoRoute from "./booking/auto/route";
import * as hkIssueRoute from "./hkissue/route";
import * as otpActionRoute from "./otp/action/route";
import * as otpLoginRoute from "./otp/login/route";
import * as verifyRoute from "./verify/route";
import * as pmsFailoverRoute from "./pmsfailover/route";
import { NextRequest } from "next/server";
import { installFakeGateway, labelRequests } from "@/test/helpers/fake-gateway";

const booking = "id=74046077780&aname=a35&lang=fr";
const get = (path) => new NextRequest(`http://localhost/api/email/${path}`, { headers: { Authorization: "token" } });
const post = (path, body) =>
    new NextRequest(`http://localhost/api/email/${path}`, { method: "POST", headers: { Authorization: "token" }, body: JSON.stringify(body) });

const routes = [
    ["booking", () => bookingRoute.GET(get(`booking?${booking}`))],
    ["cancellation", () => cancellationRoute.GET(get(`booking/cancellation?${booking}`))],
    ["request-cancellation", () => requestCancellationRoute.GET(get(`booking/request-cancellation?${booking}`))],
    ["chm", () => chmRoute.POST(post(`booking/chm?${booking}`, { operation: "COMMIT" }))],
    ["auto", () => autoRoute.GET(get(`booking/auto?${booking}&mode=pre`))],
    ["auto due", () => autoRoute.GET(get(`booking/auto?${booking}&mode=due&due_amount=250.5`))],
    ["hkissue", () => hkIssueRoute.GET(get("hkissue?property_id=42&unit_id=7&lang=fr"))],
    ["otp action", () => otpActionRoute.POST(post("otp/action?lang=fr", { otp: "123456", name: "Ana" }))],
    ["otp login", () => otpLoginRoute.POST(post("otp/login?lang=fr", { otp: "123456", name: "Ana" }))],
    ["verify", () => verifyRoute.POST(post("verify?lang=fr", { url: "https://x.igloorooms.com/verify", name: "Anna" }))],
    ["pmsfailover", () => pmsFailoverRoute.POST(post(`pmsfailover?${booking}`, { reason: "Timeout" }))],
];

describe("email labels", () => {
    let gateway;
    afterEach(() => gateway?.restore());

    test.each(routes)("the %s email loads its labels only from _EMAIL_LABELS", async (_name, call) => {
        gateway = installFakeGateway();

        await call();

        expect(labelRequests(gateway.requests)).toEqual([{ code: "fr", sections: ["_EMAIL_LABELS"] }]);
    });
});
