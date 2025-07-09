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
        // const token = verifyToken(req)
        const { otp, extraData, name } = OTPEmailSchema.parse(requestBody)
        const { searchParams } = new URL(req.url);
        // const aName = searchParams.get("aName");
        const language = searchParams.get("lang") ?? "en";

        // const data = await getSystemData({ aName: null, language, withProperty: false }, token);
        const emailHTML = await render(<OTPEmail
            otp={otp}
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
            return Response.json(error.issues, { status: 400 });
        }
        return new Response("Failed to process otp email", { status: 500 });
    }
}
