import { render } from '@react-email/components';
import OTPEmail from '@/emails/system/otp';
import { ZodError } from 'zod';
import { OTPEmailSchema } from '../../schemas';
// import { BaseSchema, OTPEmailSchema } from '../../schemas';
import { logApiError } from '@/logger';
// import { extractSearchParamsInsensitive, getSystemData, verifyToken } from '@/lib/middleware';
import { ApiError } from '@/lib/services/api.service';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export async function POST(req) {
    let requestBody = null;
    try {
        requestBody = await req.json();
        // const token = verifyToken(req)
        const { otp, geo, name } = OTPEmailSchema.parse(requestBody)
        // const { aname, lang } = BaseSchema.parse(extractSearchParamsInsensitive(req))
        // const { property } = await getSystemData({ aName: aname, language: lang, withProperty: true }, token);
        const emailHTML = await render(<OTPEmail
            otp={otp}
            // property={property}
            name={name}
            geo={geo}
        // lang={lang}
        />);
        return new Response(emailHTML);
    } catch (error) {
        logApiError(error, req, {
            body: requestBody,
            validationTarget: 'OtpEmailSchema|BaseSchema',
            step: error instanceof ZodError ? 'validation' : 'processing'
        });
        if (error instanceof ZodError) {
            return Response.json(error.issues, { status: 400 });
        }
        if (error instanceof ApiError) {
            return Response.json(error, { status: 400 })
        }
        return new Response("Failed to process otp email", { status: 500 });
    }
}
