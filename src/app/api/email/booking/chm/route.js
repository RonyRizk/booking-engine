import { render } from '@react-email/components';
import { extractSearchParamsInsensitive, getBookingData, verifyToken } from '@/lib/middleware';
import BookingCHM from '@/emails/booking/BookingCHM';
import { ZodError } from 'zod';
import { BookingCHMSchema, BookingSchema } from '../../schemas';
import { logApiError } from '@/logger';
import { ApiError } from '@/lib/services/api.service';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export async function POST(req) {
    let requestBody = null;
    try {
        requestBody = await req.json()
        const token = verifyToken(req)
        const { id, aname, lang } = BookingSchema.parse(extractSearchParamsInsensitive(req))
        const { ota_name, ota_url, operation, booking_details_url } = BookingCHMSchema.parse(requestBody)
        const data = await getBookingData({ bookingNumber: id, aName: aname, language: lang }, token);
        const emailHTML = await render(<BookingCHM {...data} operation={operation} bookingDetailsUrl={booking_details_url} channelName={ota_name} url={ota_url} lang={lang} />);
        return new Response(emailHTML);
    } catch (error) {
        logApiError(error, req, {
            body: requestBody,
            validationTarget: 'BookingSchema|BookingCHMSchema',
            step: error instanceof ZodError ? 'validation' : 'processing',
            bookingId: extractSearchParamsInsensitive(req).id || 'unknown',
            operation: requestBody?.operation || 'unknown'
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
        return new Response(`Failed to process CHM booking email: ${error.message}`, { status: 500 });
    }
}
