import { render } from '@react-email/components';
import { extractSearchParamsInsensitive, getConnectedMpo, verifyToken } from '@/lib/middleware';
import HkIssue from '@/emails/system/HkIssue';
import { HkIssueSchema } from '../schemas';
import { ZodError } from 'zod';
import { logApiError } from '@/logger';
import { ApiError } from '@/lib/services/api.service';
import { HousekeepingService } from '@/lib/services/housekeeping.service';


// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';


export async function GET(req) {
    try {
        const token = verifyToken(req)
        const { property_id, lang, unit_id } = HkIssueSchema.parse(extractSearchParamsInsensitive(req))
        const housekeepingService = new HousekeepingService("https://gateway.igloorooms.com/IR");
        housekeepingService.setToken(token)
        const [data, connectedMpo] = await Promise.all([housekeepingService.getHKIssues({ property_id, lang, unit_id }), getConnectedMpo(req)]);
        if ((data ?? []).length <= 0) {
            return Response.json({ message: 'No housekeeping issues found for this unit' }, { status: 404 })
        }
        const emailHTML = await render(<HkIssue issue={data[0]} lang={lang} connectedMpo={connectedMpo} />);
        return new Response(emailHTML);
    } catch (error) {
        logApiError(error, req, {
            body: null,
            validationTarget: 'HkIssueSchema',
            step: error instanceof ZodError ? 'validation' : 'processing',
            bookingId: extractSearchParamsInsensitive(req).id || 'unknown'
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
        return new Response(`Failed to process hk issue email: ${error.message}`, { status: 500 });
    }
}
