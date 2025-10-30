import { render } from '@react-email/components';
import { getBookingData, verifyToken, extractSearchParamsInsensitive, getConnectedMpo } from '@/lib/middleware';
import PMSFailover from '@/emails/system/PMSFailover';
import { ZodError } from 'zod';
import { logApiError } from '@/logger';
import { ApiError } from '@/lib/services/api.service';
import { PMSFailoverQuerySchema, PMSFailoverSchema } from '../schemas';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export async function POST(req) {
    let requestBody = null;
    try {
        const token = verifyToken(req);
        const queryParams = extractSearchParamsInsensitive(req);
        const { id: bookingNumber, aname: aName, lang: language } = PMSFailoverQuerySchema.parse(queryParams);

        requestBody = await req.json();
        const { reason } = PMSFailoverSchema.parse(requestBody);
        const mpo = await getConnectedMpo(req)

        const data = await getBookingData({ bookingNumber, aName, language }, token);
        const emailHTML = await render(<PMSFailover connectedMpo={mpo} {...data} reason={reason} lang={language} />);
        return new Response(emailHTML);
    } catch (error) {
        logApiError(error, req, {
            body: requestBody,
            validationTarget: 'PMSFailoverSchema|PMSFailoverQuerySchema',
            step: error instanceof ZodError ? 'validation' : 'processing'
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
        return new Response(`Failed to process PMS failover email: ${error.message}`, { status: 500 });
    }
}
