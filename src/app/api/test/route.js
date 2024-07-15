import { NextResponse } from "next/server";
import { logger } from "@/logger"; // our logger import

export async function GET(req) {

    logger.info(`GET /api/gethome ${req}`);

    return NextResponse.json({
        message: "success",
        status: 200,
    });
}