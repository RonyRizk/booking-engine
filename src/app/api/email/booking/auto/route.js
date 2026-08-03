import { render } from '@react-email/components';
import { extractSearchParamsInsensitive, getBookingData, verifyToken } from '@/lib/middleware';
import { CommonServices } from '@/lib/services/common.service';
import { AutoEmailSchema } from '../../schemas';
import { ZodError } from 'zod';
import { logApiError } from '@/logger';
import { ApiError } from '@/lib/services/api.service';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

const ACCESS_CODE_KEYS = ['ALLOW_ACCESS_CODE', 'ACCESS_CODE_PREFIX', 'ACCESS_CODE_SUFFIX', 'ACCESS_CODE'];

/**
 * Fetches the access code AC extras in parallel.
 *
 * A failing/missing key resolves to `null` so the email still renders without the section.
 *
 * @param {import('@/lib/services/common.service').CommonServices} commonService
 * @param {number} AC_ID - Identifier of the AC (the property id).
 * @returns {Promise<Record<string, string|null>|null>}
 */
async function getAccessCodeSettings(commonService, AC_ID) {
    if (!AC_ID) {
        return null;
    }
    const results = await Promise.all(
        ACCESS_CODE_KEYS.map((EXTRA_KEY) =>
            commonService.getAcExtra({ AC_ID, EXTRA_KEY }).catch(() => null)
        )
    );
    return ACCESS_CODE_KEYS.reduce((acc, key, i) => {
        const result = Array.isArray(results[i]) ? results[i][0] : results[i];
        acc[key] = result?.EXTRA_VALUE ?? null;
        return acc;
    }, {});
}

export async function GET(req) {
    try {
        const token = verifyToken(req);
        const searchParams = extractSearchParamsInsensitive(req)
        const { id, aname, lang, mode } = AutoEmailSchema.parse(searchParams)

        const commonService = new CommonServices("https://gateway.igloorooms.com/IRBE")
        commonService.setToken(token)
        commonService.setDefaultHeaders({ 'X-ClientId': 'EMAIL' })
        const [data, tables] = await Promise.all(
            [getBookingData({ bookingNumber: id, aName: aname, language: lang }, token, { 'X-ClientId': 'EMAIL' }),
            commonService.getSetupEntriesByTBLNameMulti([
                '_PRE_ARRIVAL_EMAIL',
                '_DURING_THE_STAY_EMAIL',
                '_POST_DEPARTURE_EMAIL'
            ], lang)
            ]
        );
        const accessCode = mode === 'pre'
            ? await getAccessCodeSettings(commonService, data.property?.id)
            : null;

        let Component;
        let emailHTML;

        try {
            switch (mode) {
                case "pre":
                    Component = (await import('@/emails/booking/AutoEmailPreArrival')).default;
                    emailHTML = await render(<Component {...data} setupTables={tables} lang={lang} accessCode={accessCode} />);
                    return new Response(emailHTML);

                case "post":
                    Component = (await import('@/emails/booking/AutoEmailPostDeparture')).default;
                    emailHTML = await render(<Component {...data} setupTables={tables} lang={lang} />);
                    return new Response(emailHTML);

                case "during":
                    Component = (await import('@/emails/booking/AutoEmailDuringStay')).default;
                    emailHTML = await render(<Component {...data} setupTables={tables} lang={lang} />);
                    return new Response(emailHTML);

                default:
                    throw new Error(`Invalid mode: ${mode}`);
            }
        } catch (renderError) {
            throw new Error(`Failed to render ${mode} email component: ${renderError.message}`);
        }
    } catch (error) {
        logApiError(error, req, {
            body: null,
            validationTarget: 'AutoEmailSchema',
            step: error instanceof ZodError ? 'validation' : 'processing',
            mode: extractSearchParamsInsensitive(req).mode || 'unknown'
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
        if (error.message === "No booking found") {
            return new Response("No booking found", { status: 404 });
        }
        return new Response(`Failed to process auto email: ${error.message}`, { status: 500 });
    }
}
