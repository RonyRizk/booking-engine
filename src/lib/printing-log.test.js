import { afterEach, beforeEach, describe, expect, setSystemTime, test } from "bun:test";
import { withPrintLog } from "./printing-log";
import { ApiError } from "./services/api.service";
import { capturePrintLog } from "@/test/helpers/print-log";

const INVOICE = { route: "fd", mode: "invoice", property: "a35", booking: "1001", document: "INV-1" };
const PARAMS = { domain: "a35.bookingmystay.com", id: "a35" };
const MINUTE = 60 * 1000;
const START = new Date("2026-03-01T10:00:00Z").getTime();

describe("print log", () => {
    let log;
    beforeEach(() => {
        log = capturePrintLog();
        setSystemTime(START);
    });
    afterEach(() => {
        log.restore();
        setSystemTime();
    });

    const print = (context = INVOICE, page = async () => "document") => withPrintLog(() => context, page)({ params: PARAMS, searchParams: {} });
    const printLink = (searchParams, context = INVOICE, page = async () => "document") =>
        withPrintLog(() => context, page)({ params: PARAMS, searchParams });

    describe("repeats", () => {
        test("reprinting a document within 10 minutes writes nothing new", async () => {
            await print();
            setSystemTime(START + 9 * MINUTE);
            await print();

            expect(log.entries()).toHaveLength(1);
        });

        test("the first line after the 10 minutes says how many repeats it skipped", async () => {
            await print();
            await print();
            await print();
            setSystemTime(START + 10 * MINUTE);
            await print();

            expect(log.entries().map((entry) => entry.skipped)).toEqual([undefined, 2]);
        });

        test("another document is still logged", async () => {
            await print();
            await print({ ...INVOICE, document: "INV-2" });

            expect(log.entries().map((entry) => entry.document)).toEqual(["INV-1", "INV-2"]);
        });

        test("a document that printed and then failed logs both", async () => {
            await print();
            await print(INVOICE, async (_props, pageLog) => pageLog.failed(new Error("Down")));

            expect(log.entries().map((entry) => entry.message)).toEqual(["print succeeded", "print failed"]);
        });

        test("a document that fails again the same way is logged once", async () => {
            const failing = async (_props, pageLog) => pageLog.failed(new Error("Down"));
            await print(INVOICE, failing);
            await print(INVOICE, failing);

            expect(log.entries()).toHaveLength(1);
        });

        test("a failure that echoes a different token each time is still one repeat", async () => {
            const echoing = async ({ searchParams }, pageLog) => pageLog.failed(new Error(`${searchParams.token} : invalid`));
            const failFor = (token) => printLink({ token }, INVOICE, echoing);
            await failFor("token-a");
            await failFor("token-b");

            expect(log.entries()).toHaveLength(1);
        });

        test("the same document asked for with other noise in its link is still one repeat", async () => {
            await printLink({ mode: "invoice", cachebuster: "1" });
            await printLink({ mode: "invoice", cachebuster: "2" });

            expect(log.entries()).toHaveLength(1);
        });

        test("bad links are limited by reason, however their values vary", async () => {
            const rejected = async (_props, pageLog) => pageLog.rejected("unknown mode");
            for (let i = 0; i < 50; i++) {
                await print({ ...INVOICE, mode: `probe-${i}` }, rejected);
            }

            expect(log.entries()).toHaveLength(1);
        });

        test("memory stays bounded: past 1000 outcomes the oldest is forgotten and the newest kept", async () => {
            for (let i = 0; i <= 1000; i++) {
                await print({ ...INVOICE, document: `INV-${i}` });
            }
            const before = log.entries().length;
            await print({ ...INVOICE, document: "INV-1000" });
            await print({ ...INVOICE, document: "INV-0" });

            expect(log.entries().slice(before).map((entry) => entry.document)).toEqual(["INV-0"]);
        });
    });

    describe.each([["production", "production"], ["unset", undefined], ["empty", ""]])("when APP_ENV is %s", (_name, appEnv) => {
        beforeEach(() => {
            if (appEnv === undefined) delete process.env.APP_ENV;
            else process.env.APP_ENV = appEnv;
        });

        test("a successful print writes nothing, but the page still renders", async () => {
            expect([await print(), log.entries()]).toEqual(["document", []]);
        });

        test("a rejected link writes nothing", async () => {
            await print(INVOICE, async (_props, pageLog) => pageLog.rejected("missing token"));

            expect(log.entries()).toEqual([]);
        });

        test("a failure is still written", async () => {
            await print(INVOICE, async (_props, pageLog) => pageLog.failed(new Error("Down")));

            expect(log.entries()).toEqual([expect.objectContaining({ level: "error", message: "print failed" })]);
        });

        test("a page crash is still written", async () => {
            await print(INVOICE, async () => {
                throw new Error("Crash");
            }).catch(() => {});

            expect(log.entries()).toEqual([expect.objectContaining({ level: "error", message: "print failed" })]);
        });
    });

    test.each(["testing", " Testing "])("APP_ENV=%j writes successful prints", async (appEnv) => {
        process.env.APP_ENV = appEnv;
        await print();

        expect(log.entries()).toEqual([expect.objectContaining({ message: "print succeeded" })]);
    });

    describe("what a line contains", () => {
        test.each([
            ["booking", "https://a35.bookingmystay.com/a35/printing?mode=invoice&id=1001"],
            ["fd", "https://a35.bookingmystay.com/a35/printing/fd?mode=invoice&id=1001"],
            ["cl", "https://a35.bookingmystay.com/a35/printing/cl?mode=invoice&id=1001"],
        ])("a %s print names the link it was opened from", async (route, url) => {
            await printLink({ mode: "invoice", id: "1001" }, { ...INVOICE, route });

            expect(log.entries()[0].url).toBe(url);
        });

        test("a rejected link is logged with its url", async () => {
            await printLink({ mode: "probe" }, INVOICE, async (_props, pageLog) => pageLog.rejected("unknown mode"));

            expect(log.entries()[0]).toEqual(expect.objectContaining({ message: "print rejected", url: "https://a35.bookingmystay.com/a35/printing/fd?mode=probe" }));
        });

        test("a failure is logged with its url", async () => {
            await printLink({ mode: "invoice" }, INVOICE, async (_props, pageLog) => pageLog.failed(new Error("Down")));

            expect(log.entries()[0]).toEqual(expect.objectContaining({ message: "print failed", url: "https://a35.bookingmystay.com/a35/printing/fd?mode=invoice" }));
        });

        test("special characters in the link stay encoded", async () => {
            await printLink({ ref: "a b&c" });

            expect(log.entries()[0].url).toBe("https://a35.bookingmystay.com/a35/printing/fd?ref=a+b%26c");
        });

        test("the url keeps the token, so the link can be opened again", async () => {
            await printLink({ token: "secret-token", mode: "invoice" });

            expect(log.entries()[0].url).toBe("https://a35.bookingmystay.com/a35/printing/fd?token=secret-token&mode=invoice");
        });

        test("the url is the only place a line carries the token", async () => {
            const echoing = async (_props, pageLog) => pageLog.failed(new Error("secret-token : invalid"));
            await printLink({ token: "secret-token" }, INVOICE, echoing);

            const { url, ...rest } = log.entries()[0];
            expect([url.includes("secret-token"), JSON.stringify(rest).includes("secret-token")]).toEqual([true, false]);
        });

        test("a url is cut down to size", async () => {
            await printLink({ ref: "x".repeat(5000) });

            expect(log.entries()[0].url).toHaveLength(2048);
        });

        test("the token never reaches the line, even in an ApiError's request headers", async () => {
            const error = new ApiError("Request failed", 500, "HTTP_ERROR", null, { Authorization: "secret-token" });
            await print({ ...INVOICE, token: "secret-token" }, async (_props, pageLog) => pageLog.failed(error));

            expect(log.lines().join()).not.toContain("secret-token");
        });

        test("a gateway error is cut down to size", async () => {
            await print(INVOICE, async (_props, pageLog) => pageLog.failed(new Error("x".repeat(5000))));

            expect(log.lines()[0].length).toBeLessThan(3000);
        });

        test("keeps the gateway's status with the failure", async () => {
            await print(INVOICE, async (_props, pageLog) => pageLog.failed(new ApiError("Request failed", 500, "HTTP_ERROR")));

            expect(log.entries()[0].error).toEqual(expect.objectContaining({ statusCode: 500, errorCode: "HTTP_ERROR" }));
        });

        test("cuts values from the URL down to size", async () => {
            await print({ ...INVOICE, document: "x".repeat(5000) });

            expect(log.entries()[0].document).toBe("x".repeat(64));
        });
    });
});
