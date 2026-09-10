import "../globals.css";
import { headers } from "next/headers";
import { v4 } from "uuid";
import { getExposedProperty } from "../../lib/actions";

export async function generateMetadata({ params }, parent) {
  const parentMetadata = await parent;
  const domain = decodeURIComponent(params.domain).split('.');
  const result = await getExposedProperty({ perma_link: domain[0], aName: "" });
  const previousImages = parentMetadata.openGraph?.images || [];
  const logo = result?.space_theme?.favicon;
  let title = "igloorooms";
  if (result?.name) {
    title = `${result?.name}, ${(result?.country?.name) ?? ""} - Book direct`;
  }

  const galleryImages = result?.images ?? [];
  const propertyName = result?.name ?? 'igloorooms';
  const imageAlt = (img) => (img.tooltip ? `${propertyName} - ${img.tooltip}` : propertyName);
  const structuredImages = galleryImages.flatMap((img) => ([
    {
      url: img.url,
      width: 1800,
      height: 1600,
      alt: imageAlt(img),
      type: 'image/png',
    },
    {
      url: img.url,
      width: 800,
      height: 600,
      alt: imageAlt(img),
      type: 'image/png',
    },
  ]));

  const logoImage = logo
    ? [{ url: logo, alt: propertyName, width: 512, height: 512, type: 'image/png' }]
    : [];

  return {
    title,
    images: structuredImages,
    icons: {
      icon: logo,
    },
    description: `${result?.name}, ${result?.country?.name} prices and availability`,
    openGraph: {
      title,
      images: [
        ...structuredImages,
        ...logoImage,
        ...previousImages,
      ].filter(Boolean),
    },
  };
}
const rootPages = new Set(['/', '/signin', '/booked'])
export default async function layout({ children, params }) {
  // The web-component loader and the JSON-LD structured data belong to the root
  // booking page only, not to any nested route ([id], booked, signin, ...).
  // `x-current-path` is set by src/middleware.js from the pre-rewrite pathname.
  const isRootPage = rootPages.has(headers().get("x-current-path"));

  let jsonld = null;
  if (isRootPage) {
    try {
      const domain = decodeURIComponent(params.domain).split(".");
      const property = await getExposedProperty({ perma_link: domain[0], aName: "" });
      jsonld = property?.jsonld ?? null;
    } catch {
      jsonld = null;
    }
  }
  return (
    <html lang="en" suppressHydrationWarning>
      {isRootPage && (
        <head>
          <script
            type="module"
            src={`https://wb-cmp.igloorooms.com/be/dist/iglooroom/iglooroom.esm.js?v=${v4()}`}
            defer
          ></script>
          {jsonld ? (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: jsonld }}
            />
          ) : null}
        </head>
      )}
      <body>
        {children}
      </body>
    </html>
  );
}
