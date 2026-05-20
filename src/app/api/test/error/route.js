import { logApiError } from "@/logger";
import { NextResponse } from "next/server";
// import { logger } from "@/logger"; // our logger import

export async function GET(req) {

    // logger.info(`GET /api/gethome ${req}`);
    logApiError("hello world", req)
    return NextResponse.json({
        message: "success",
        status: 200,
    });
}
