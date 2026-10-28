import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FiscalDocumentTable } from "./fiscal-document-table";

const property = {
    roomtypes: [{ id: 11, name: "Deluxe", physicalrooms: [{ id: 101, name: "101" }], rateplans: [] }],
};

const night = (SERVICE_DATE) => ({
    BOOK_NBR: "B-1",
    BSA_REF: "BSA-1",
    PR_ID: 101,
    ROOM_CATEGORY_ID: 11,
    ROOM_TYPE_ID: 11,
    FROM_DATE: "2026-01-05",
    TO_DATE: "2026-01-07",
    SERVICE_DATE,
    NET_AMOUNT: 100,
    TOTAL_AMOUNT: 100,
});

const transactions = [night("2026-01-05"), night("2026-01-06")];

const render = (props) =>
    renderToStaticMarkup(createElement(FiscalDocumentTable, { transactions, property, ...props }));

// Text of the Date cell of every transaction row. Booking and unit banner
// rows are a single colSpan cell, so they are skipped.
const dateCells = (html) => {
    const body = html.slice(html.indexOf("<tbody"));
    return [...body.matchAll(/<tr[^>]*>(.*?)<\/tr>/gs)]
        .map(([, row]) => [...row.matchAll(/<td([^>]*)>(.*?)<\/td>/gs)])
        .filter((cells) => cells.length > 1 && !/colspan/i.test(cells[0][1]))
        .map((cells) => cells[0][2].replace(/<[^>]+>/g, "").trim())
        .slice(0, -1); // drop the totals row
};

describe("FiscalDocumentTable collapsed units", () => {
    test("collapsed row shows the agent's custom code for its room type instead of a date", () => {
        const html = render({
            collapseUnits: true,
            rtNamings: [{ id: 1, name: "DLX-AG", room_type_id: 11 }],
        });

        expect(dateCells(html)).toEqual(["DLX-AG"]);
    });

    test("collapsed row stays blank when the agent has no code for its room type", () => {
        const html = render({
            collapseUnits: true,
            rtNamings: [{ id: 1, name: "STD-AG", room_type_id: 99 }],
        });

        expect(dateCells(html)).toEqual([""]);
    });

    test("uncollapsed rows keep their dates even when the room type has a code", () => {
        const html = render({
            collapseUnits: false,
            rtNamings: [{ id: 1, name: "DLX-AG", room_type_id: 11 }],
        });

        expect(dateCells(html)).toEqual(["Jan 05, 2026", "Jan 06, 2026"]);
        expect(html).not.toContain("DLX-AG");
    });
});
