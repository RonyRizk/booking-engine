import { render } from '@react-email/components';
import VerifyEmail from '@/emails/system/VerifyEmail';
import { z, ZodError } from 'zod';
import { LanguageSchema } from '../schemas';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';
const VerifyEmailSchema = z.object({
    url: z.string().url(),
    name: z.string().min(3),
    lang: LanguageSchema
})
export async function POST(req) {
    try {
        const { url, name, lang } = VerifyEmailSchema.parse(await req.json())
        const emailHTML = await render(<VerifyEmail
            url={url}
            name={name}
            lang={lang}
        />);
        return new Response(emailHTML);
    } catch (error) {
        if (error instanceof ZodError) {
            return Response.json(error.issues, { status: 400 });
        }
        return new Response(error.message, { status: 500 });
    }
}
