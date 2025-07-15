import { render } from '@react-email/components';
import { extractSearchParamsInsensitive, getBookingData, verifyToken } from '@/lib/middleware';
import { CommonServices } from '@/lib/services/common.service';
import { AutoEmailSchema } from '../../schemas';
import { ZodError } from 'zod';
import { logApiError } from '@/logger';
import { ApiError } from '@/lib/services/api.service';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';


export async function GET(req) {
    try {
        const token = verifyToken(req);
        const searchParams = extractSearchParamsInsensitive(req)
        const { id, aname, lang, mode } = AutoEmailSchema.parse(searchParams)

        const commonService = new CommonServices("https://gateway.igloorooms.com/IRBE")
        commonService.setToken(token)
        const [data, tables] = await Promise.all(
            [getBookingData({ bookingNumber: id, aName: aname, language: lang }, token),
            commonService.getSetupEntriesByTBLNameMulti([
                '_PRE_ARRIVAL_EMAIL',
                '_DURING_THE_STAY_EMAIL',
                '_POST_DEPARTURE_EMAIL'
            ], lang)
            ]
        );
        let Component;
        let emailHTML;

        try {
            switch (mode) {
                case "pre":
                    Component = (await import('@/emails/booking/AutoEmailPreArrival')).default;
                    emailHTML = await render(<Component {...data} setupTables={tables} lang={lang} />);
                    return new Response(emailHTML);

                case "post":
                    Component = (await import('@/emails/booking/AutoEmailPostDeparture')).default;
                    emailHTML = await render(<Component {...data} setupTables={tables} lang={lang} />);
                    return new Response(emailHTML);

                case "during":
                    Component = (await import('@/emails/booking/AutoEmailDuringStay')).default;
                    emailHTML = await render(<Component {...data} setupTables={tables} lang={lang} />);
                    return new Response(emailHTML);

                default:
                    throw new Error(`Invalid mode: ${mode}`);
            }
        } catch (renderError) {
            throw new Error(`Failed to render ${mode} email component: ${renderError.message}`);
        }
    } catch (error) {
        logApiError(error, req, {
            body: null,
            validationTarget: 'AutoEmailSchema',
            step: error instanceof ZodError ? 'validation' : 'processing',
            mode: extractSearchParamsInsensitive(req).mode || 'unknown'
        });
        if (error instanceof ZodError) {
            return Response.json({
                error: 'Validation failed',
                issues: error.issues
            }, { status: 400 });
        }
        if (error instanceof ApiError) {
            return Response.json(error, { status: 400 });
        }
        if (error.message === "No booking found") {
            return new Response("No booking found", { status: 404 });
        }
        return new Response(`Failed to process auto email: ${error.message}`, { status: 500 });
    }
}
