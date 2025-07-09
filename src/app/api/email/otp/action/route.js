import { render } from '@react-email/components';
// import { verifyToken, getSystemData } from '@/lib/middleware';
import OTPEmail from '@/emails/system/otp';
import { ZodError } from 'zod';
import { OTPEmailSchema } from '../../schemas';
import { logApiError } from '@/logger';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';


export async function POST(req) {
    let requestBody = null;

    try {
        requestBody = await req.json();
        const { otp, extraData, name } = OTPEmailSchema.parse(requestBody);

        const { searchParams } = new URL(req.url);
        const language = searchParams.get("lang") ?? "en";

        const emailHTML = await render(<OTPEmail
            otp={otp}
            variant="action"
            name={name}
            extraData={extraData}
            lang={language}
        />);

        return new Response(emailHTML);
    } catch (error) {
        logApiError(error, req, {
            body: requestBody,
            validationTarget: 'OtpEmailSchema',
            step: error instanceof ZodError ? 'validation' : 'processing'
        });

        if (error instanceof ZodError) {
            return Response.json({
                error: 'Validation failed',
                issues: error.issues
            }, { status: 400 });
        }

        return new Response("Failed to process otp email", { status: 500 });
    }
}
