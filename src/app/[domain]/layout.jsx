import "../globals.css";
import Script from 'next/script';
import { v4 } from "uuid";
import { getExposedProperty } from "../../lib/actions"
import { headers } from "next/headers";
import { extractAndRemoveScriptTags } from "@/lib/utils";

export async function generateMetadata({ params }, parent) {
  const domain = decodeURIComponent(params.domain).split('.');
  const result = await getExposedProperty({ perma_link: domain[0], aName: "" });
  const previousImages = (await parent).openGraph?.images || [];
  const logo = result?.space_theme?.favicon
  let title = "igloorooms"
  if (result?.name) {
    title = `${result?.name}, ${(result?.country?.name) ?? ""} - Book direct`
  }
  return {
    title,
    images: result?.images?.map((img) => (
      {
        url: img.url,
        width: 1800,
        height: 1600,
        alt: img.tooltip ? `${result?.name} - ${img.tooltip}` : result?.name,

      },

      {
        url: img.url,
        width: 800,
        height: 600,
      }
    )),
    icons: {
      icon: logo,
    },
    description: `${result?.name}, ${result?.country?.name} prices and availability`,
    openGraph: {
      images: [logo, ...previousImages],
    },
  };
}
export default async function layout({ children, params }) {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  const { bodyTags, footerTags, headTags } = await getPropertyTags(params, pathname);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="module" src={`https://wb-cmp.igloorooms.com/be/dist/iglooroom/iglooroom.esm.js?v=${v4()}`} defer></script>
        {headTags?.map((tag) =>
          <Script id={tag.id} key={tag.id} strategy="afterInteractive">
            {extractAndRemoveScriptTags(tag.body)}
          </Script>
        )}
      </head>
      <body>
        {bodyTags?.map((tag) =>
          <Script id={tag.id} key={tag.id} strategy="afterInteractive">
            {extractAndRemoveScriptTags(tag.body)}
          </Script>
        )}
        {children}
        {footerTags.length > 0 && <footer>
          {footerTags?.map((tag) =>
            <Script id={tag.id} key={tag.id} strategy="afterInteractive">
              {extractAndRemoveScriptTags(tag.body)}
            </Script>
          )}
        </footer>}
      </body>
    </html>
  );
}

async function getPropertyTags(params, pathname) {
  if (pathname !== "/") {
    return { headTags: [], bodyTags: [], footerTags: [] };
  }
  const baseDomain = decodeURIComponent(params.domain).split('.')[0];
  const result = await getExposedProperty({ perma_link: baseDomain, aName: "" }) || { tags: [] };

  const headTags = [];
  const bodyTags = [];
  const footerTags = [];

  result.tags.forEach(tag => {
    if (tag.value) {
      const newTag = { body: tag.value, id: v4() };
      switch (tag.key) {
        case 'header':
          headTags.push(newTag);
          break;
        case 'body':
          bodyTags.push(newTag);
          break;
        case 'footer':
          footerTags.push(newTag);
          break;

      }
    }
  });

  return { headTags, bodyTags, footerTags };
}
