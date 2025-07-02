import { render } from '@react-email/components';
import { getBookingData, verifyToken } from '@/lib/middleware';
import PMSFailover from '@/emails/system/PMSFailover';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const token = verifyToken(req);
        const { searchParams } = new URL(req.url);
        const bookingNumber = searchParams.get("id");
        const aName = searchParams.get("aName");
        const language = searchParams.get("lang");

        const { reason } = await req.json()

        if (!bookingNumber || !aName || !language) {
            return new Response("Missing required query parameters: id, aName, lang", { status: 400 });
        }
        const data = await getBookingData({ bookingNumber, aName, language }, token);
        const emailHTML = await render(<PMSFailover {...data} reason={reason} lang={language} />);
        return new Response(emailHTML);
    } catch (error) {
        console.error("Error rendering email:", error);
        return new Response("Failed to process booking email", { status: 500 });
    }
}
