import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    ],
};

export default async function middleware(req) {
    const url = req.nextUrl;

    // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
    let hostname = req.headers
        .get("host")
        .replace(".localhost:7742", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
    // special case for Vercel preview deployment URLs
    if (
        hostname.includes("---") &&
        hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
    ) {
        hostname = `${hostname.split("---")[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN
            }`;
    }
    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
        }`;
    console.log("hostname", hostname)
    if (
        hostname === "localhost:7742"
    ) {
        return NextResponse.rewrite(
            new URL(`/iglooroomsdemohotel.bookingstay.com${path === "/" ? "" : path}`, req.url),
        );
    }
    if (hostname.split('.').length <= 2) {
        return NextResponse.redirect("https://info.igloorooms.com")
    }
    return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}