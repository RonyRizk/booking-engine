import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import PrintButtonClient from "./PrintButtonClient";

describe("print button", () => {
    let print;
    beforeEach(() => {
        print = mock();
        globalThis.window = { print };
    });
    afterEach(() => {
        delete globalThis.window;
    });

    /** Clicks the button the way the browser would: through its onClick. */
    const click = (button) => button.props.onClick({ type: "click" });

    test("opens the browser's print dialog when clicked", () => {
        click(PrintButtonClient({ label: "Print" }));

        expect(print).toHaveBeenCalledTimes(1);
    });
});
