import { renderToReadableStream } from 'react-dom/server.edge';
import TestCmp from "@/components/TestCmp";

export const runtime = 'edge';
function PrintDocument() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <base href="http://localhost:5863" />
                <link rel="preload" as="image" href="https://gateway.igloorooms.com/irimages/aclogo/AcLogo_42.png" />
                <link rel="preload" as="image" href="https://x.igloorooms.com/assets/images/png/direct.png" />
                <title>igloorooms Demo Hotel, Lebanon - Book direct</title>
            </head>
            <body>
                <TestCmp extra={"!!!"} />
            </body>
        </html>
    );
}

export async function GET() {
    const stream = await renderToReadableStream(<PrintDocument />);
    await stream.allReady;
    const html = await new Response(stream).text();
    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}
