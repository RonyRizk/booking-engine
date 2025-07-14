import { render } from '@react-email/components';
import { getBookingData, verifyToken, extractSearchParamsInsensitive } from '@/lib/middleware';
import PMSFailover from '@/emails/system/PMSFailover';
import { ZodError, z } from 'zod';
import { logApiError } from '@/logger';
import { ApiError } from '@/lib/services/api.service';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

const PMSFailoverSchema = z.object({
    reason: z.string().min(1, "Reason is required")
});

const PMSFailoverQuerySchema = z.object({
    id: z.string().min(3, "Booking ID must be at least 3 characters"),
    aname: z.string().min(3, "Property name must be at least 3 characters"), 
    lang: z.string().length(2, "Language must be 2 characters").default('en')
});

export async function POST(req) {
    let requestBody = null;
    try {
        const token = verifyToken(req);
        const queryParams = extractSearchParamsInsensitive(req);
        const { id: bookingNumber, aname: aName, lang: language } = PMSFailoverQuerySchema.parse(queryParams);
        
        requestBody = await req.json();
        const { reason } = PMSFailoverSchema.parse(requestBody);

        const data = await getBookingData({ bookingNumber, aName, language }, token);
        const emailHTML = await render(<PMSFailover {...data} reason={reason} lang={language} />);
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
