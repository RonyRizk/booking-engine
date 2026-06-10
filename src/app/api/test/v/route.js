import { NextResponse } from "next/server";
// import { logger } from "@/logger"; // our logger import

export async function GET(req) {

    // logger.info(`GET /api/gethome ${req}`);

    return NextResponse.json({
        message: "1.1",
        status: 200,
    });
}
