import { render } from '@react-email/components';
import OTPEmail from '@/emails/system/otp';
import { ZodError } from 'zod';
import { LanguageSchema, OTPEmailSchema } from '../../schemas';
// import { BaseSchema, OTPEmailSchema } from '../../schemas';
import { logApiError } from '@/logger';
// import { extractSearchParamsInsensitive, getSystemData, verifyToken } from '@/lib/middleware';
import { ApiError } from '@/lib/services/api.service';
import { extractSearchParamsInsensitive, getConnectedMpo, getOptionalToken } from '@/lib/middleware';
import { EMAIL_LABELS, fetchLabels } from '@/lib/labels';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export async function POST(req) {
    let requestBody = null;
    try {
        requestBody = await req.json();
        const { otp, geo, name } = OTPEmailSchema.parse(requestBody);
        const lang = LanguageSchema.parse(extractSearchParamsInsensitive(req)?.lang)
        const [mpo, i18n] = await Promise.all([
            getConnectedMpo(req, { 'X-ClientId': 'EMAIL' }),
            fetchLabels(EMAIL_LABELS, lang, { token: getOptionalToken(req), headers: { 'X-ClientId': 'EMAIL' } }),
        ])
        // const token = verifyToken(req)
        // const { aname, lang } = BaseSchema.parse(extractSearchParamsInsensitive(req))
        // const { property } = await getSystemData({ aName: aname, language: lang, withProperty: true }, token);
        const emailHTML = await render(<OTPEmail
            otp={otp}
            // property={property}
            name={name}
            geo={geo}
            connectedMpo={mpo}
            i18n={i18n}
        />);
        return new Response(emailHTML);
    } catch (error) {
        logApiError(error, req, {
            body: requestBody,
            validationTarget: 'OTPEmailSchema',
            step: error instanceof ZodError ? 'validation' : 'processing',
            otpLength: requestBody?.otp?.length || 0,
            userName: requestBody?.name || 'unknown'
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
        return new Response(`Failed to process OTP login email: ${error.message}`, { status: 500 });
    }
}
