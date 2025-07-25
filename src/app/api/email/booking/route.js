import { render } from '@react-email/components';
import { extractSearchParamsInsensitive, getBookingData, verifyToken } from '@/lib/middleware';
import BookingEmail from '@/emails/booking';
import { BookingSchema } from '../schemas';
import { ZodError } from 'zod';
import { logApiError } from '@/logger';
import { ApiError } from '@/lib/services/api.service';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';


export async function GET(req) {
    try {
        const token = verifyToken(req)
        const { id, aname, lang } = BookingSchema.parse(extractSearchParamsInsensitive(req))
        const data = await getBookingData({ bookingNumber: id, aName: aname, language: lang }, token);
        const emailHTML = await render(<BookingEmail {...data} lang={lang} />);
        return new Response(emailHTML);
    } catch (error) {
        logApiError(error, req, {
            body: null,
            validationTarget: 'BookingSchema',
            step: error instanceof ZodError ? 'validation' : 'processing',
            bookingId: extractSearchParamsInsensitive(req).id || 'unknown'
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
        return new Response(`Failed to process booking email: ${error.message}`, { status: 500 });
    }
}
