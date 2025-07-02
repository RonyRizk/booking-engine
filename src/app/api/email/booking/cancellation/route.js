import { render } from '@react-email/components';
import { extractSearchParamsInsensitive, getBookingData, verifyToken } from '@/lib/middleware';
import BookingCancellationEmail from '@/emails/booking/cancellation';
import { BookingSchema } from '../../schemas';
import { ZodError } from 'zod';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';



export async function GET(req) {
    try {
        const token = verifyToken(req)
        const { id, aname, lang } = BookingSchema.parse(extractSearchParamsInsensitive(req))

        const data = await getBookingData({ bookingNumber: id, aName: aname, language: lang, includePenaltyStatement: true }, token);
        const emailHTML = await render(<BookingCancellationEmail {...data} lang={lang} />);
        return new Response(emailHTML);
    } catch (error) {
        if (error instanceof ZodError) {
            return Response.json(error.issues, { status: 400 });
        }
        if (error.message === "No booking found") {
            return new Response("No booking found", { status: 404 });
        }
        return new Response(error.message, { status: 500 });
    }
}
