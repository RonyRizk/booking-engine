import { render } from '@react-email/components';
import VerifyEmail from '@/emails/system/VerifyEmail';
import { ZodError } from 'zod';
import { VerifyEmailSchema } from '../schemas';
import { logApiError } from '@/logger';
import { getConnectedMpo } from '@/lib/middleware';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export async function POST(req) {
    let requestBody
    try {
        requestBody = await req.json()
        const { url, name, lang } = VerifyEmailSchema.parse(requestBody)
        const mpo = await getConnectedMpo(req)
        const emailHTML = await render(<VerifyEmail
            url={url}
            name={name}
            lang={lang}
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
