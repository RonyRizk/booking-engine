import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { getExposedProperty } from "./actions";
import { installFakeGateway } from "@/test/helpers/fake-gateway";

describe("getExposedProperty", () => {
    let gateway;
    beforeEach(() => {
        let issued = 0;
        gateway = installFakeGateway({
            "/Get_BE_Token": () => `token-${++issued}`,
            "/Get_Exposed_Property": { name: "Demo Hotel" },
        });
    });
    afterEach(() => gateway.restore());

    test("concurrent requests each send the token they were issued", async () => {
        await Promise.all([getExposedProperty({ aName: "a35", perma_link: "" }), getExposedProperty({ aName: "b12", perma_link: "" })]);

        const sent = gateway.requests.filter((r) => r.endpoint === "/Get_Exposed_Property").map((r) => r.authorization);

        expect(sent.toSorted()).toEqual(["token-1", "token-2"]);
    });
});
