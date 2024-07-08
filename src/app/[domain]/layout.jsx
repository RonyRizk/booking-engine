import "../globals.css";
import Script from 'next/script';
import { v4 } from "uuid";
import { getExposedProperty } from "../../utils/actions"

export async function generateMetadata({ params, searchParams }, parent) {
  const domain = decodeURIComponent(params.domain).split('.');
  const result = await getExposedProperty(domain[0]);
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `${result?.name}, ${result?.country?.name} - Book direct`,
    images: [
      {
        url: result?.space_theme?.logo,
        width: 800,
        height: 600,
      },
      {
        url: result?.space_theme?.logo,
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    icons: {
      icon: result?.space_theme?.logo,
    },
    description: `${result?.name}, ${result?.country?.name} prices and availability`,
    openGraph: {
      images: [result?.space_theme?.logo, ...previousImages],
    },
  };
}
export default function layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        {/* <Script type="module" src={`https://david1chowaifaty.github.io/igloo-calendar-main-web/be-dist/iglooroom/iglooroom.esm.js?v=${v4()}`} strategy="beforeInteractive" /> */}
        <Script type="module" src={`${process.env.BE_COMPONENT_URL}?v=${v4()}`} strategy="beforeInteractive" />
      </body>
    </html>
  );
}

