import { render } from '@react-email/components';
import VerifyEmail from '@/emails/system/VerifyEmail';
import { ZodError } from 'zod';
import { LanguageSchema, VerifyEmailSchema } from '../schemas';
import { logApiError } from '@/logger';
import { extractSearchParamsInsensitive, getConnectedMpo, getOptionalToken } from '@/lib/middleware';
import { EMAIL_LABELS, fetchLabels } from '@/lib/labels';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export async function POST(req) {
    let requestBody
    try {
        requestBody = await req.json()
        const { url, name } = VerifyEmailSchema.parse(requestBody);
        const lang = LanguageSchema.parse(extractSearchParamsInsensitive(req)?.lang)
        const [mpo, i18n] = await Promise.all([
            getConnectedMpo(req, { 'X-ClientId': 'EMAIL' }),
            fetchLabels(EMAIL_LABELS, lang, { token: getOptionalToken(req), headers: { 'X-ClientId': 'EMAIL' } }),
        ])
        const emailHTML = await render(<VerifyEmail
            url={url}
            name={name}
            i18n={i18n}
            connectedMpo={mpo}
        />);
        return new Response(emailHTML);
    } catch (error) {
        logApiError(error, req, {
            body: requestBody,
            validationTarget: 'VerifyEmailSchema',
            step: error instanceof ZodError ? 'validation' : 'processing',
            userName: requestBody?.name || 'unknown',
            hasUrl: !!requestBody?.url
        });
        if (error instanceof ZodError) {
            return Response.json({
                error: 'Validation failed',
                issues: error.issues
            }, { status: 400 });
        }
        return new Response(`Failed to process verify email: ${error.message}`, { status: 500 });
    }
}
