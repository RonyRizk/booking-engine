import { render } from '@react-email/components';
import { extractSearchParamsInsensitive, getBookingData, verifyToken } from '@/lib/middleware';
import BookingCHM from '@/emails/booking/BookingCHM';
import { ZodError } from 'zod';
import { BookingCHMSchema, BookingSchema } from '../../schemas';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const token = verifyToken(req)
        const { id, aname, lang } = BookingSchema.parse(extractSearchParamsInsensitive(req))
        const { ota_name, ota_url, operation, booking_details_url } = BookingCHMSchema.parse(await req.json())
        const data = await getBookingData({ bookingNumber: id, aName: aname, language: lang }, token);
        const emailHTML = await render(<BookingCHM {...data} operation={operation} bookingDetailsUrl={booking_details_url} channelName={ota_name} url={ota_url} lang={lang} />);
        return new Response(emailHTML);
    } catch (error) {
        if (error instanceof ZodError) {
            return Response.json(error.issues, { status: 400 });
        }
        if (error.message === "No booking found") {
            return new Response("No booking found", { status: 404 });
        }
        return new Response(error.toString(), { status: 500 });
    }
}
