import { headers } from "next/headers";

// Pre-rewrite pathname, as `src/middleware.js` sets it: `/[id]/printing/...`.
const PRINTING_PATH = /^\/[^/]+\/printing(\/|$)/;

/** Whether this request is for a print page, whose metadata nobody reads. */
export const isPrintingRequest = () => PRINTING_PATH.test(headers().get("x-current-path") ?? "");
