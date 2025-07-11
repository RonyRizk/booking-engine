import { render } from '@react-email/components';
import { extractSearchParamsInsensitive, getBookingData, verifyToken } from '@/lib/middleware';
import { CommonServices } from '@/lib/services/common.service';
import { AutoEmailSchema } from '../../schemas';
import { ZodError } from 'zod';
import { logApiError } from '@/logger';

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
        switch (mode) {
            case "pre":
                Component = (await import('@/emails/booking/AutoEmailPreArrival')).default;
                return new Response(await render(<Component {...data} setupTables={tables} lang={lang} />), {
                    headers: {
                        'content-type': 'text/html'
                    }
                });

            case "post":
                Component = (await import('@/emails/booking/AutoEmailPostDeparture')).default;
                return new Response(await render(<Component {...data} setupTables={tables} lang={lang} />), {
                    headers: {
                        'content-type': 'text/html'
                    }
                });

            case "during":
                Component = (await import('@/emails/booking/AutoEmailDuringStay')).default;
                return new Response(await render(<Component {...data} setupTables={tables} lang={lang} />));

            default:
                return new Response("Invalid mode", { status: 400 });
        }
    } catch (error) {
        logApiError(error, req, {
            body: null,
            validationTarget: 'ActionOtpEmailSchema',
            step: error instanceof ZodError ? 'validation' : 'processing'
        });
        if (error instanceof ZodError) {
            return Response.json(error.issues, { status: 400 });
        }
        if (error.message === "No booking found") {
            return new Response("No booking found", { status: 404 });
        }
        return new Response(error.message, { status: 500 });
    }
}
