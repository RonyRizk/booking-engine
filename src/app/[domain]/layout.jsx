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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="module" src={`https://wb-cmp.igloorooms.com/be/dist/iglooroom/iglooroom.esm.js?v=${v4()}`} defer></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
