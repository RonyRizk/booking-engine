import { render } from '@react-email/components';
// import { verifyToken, getSystemData } from '@/lib/middleware';
import OTPEmail from '@/emails/system/otp';
import { z, ZodError } from 'zod';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

const VerifyEmailSchema = z.object({
    otp: z.string().min(4),
    extraData: z.optional(z.any()),
    name: z.string().nonempty()
})

export async function POST(req) {
    try {
        // const token = verifyToken(req)
        const { otp, extraData, name } = VerifyEmailSchema.parse(await req.json())
        const { searchParams } = new URL(req.url);
        // const aName = searchParams.get("aName");
        const language = searchParams.get("lang");

        // const data = await getSystemData({ aName: null, language, withProperty: false }, token);
        const emailHTML = await render(<OTPEmail
            otp={otp}
            propertyName={name}
            extraData={extraData}
            // {...data}
            lang={language}
        />);
        return Response.json({ My_Result: emailHTML.toString() }, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return Response.json(error.issues, { status: 400 });
        }
        return new Response("Failed to process otp email", { status: 500 });
    }
}
