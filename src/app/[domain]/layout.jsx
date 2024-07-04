import React from "react";
import { Inter } from "next/font/google";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });
import axios from "axios";
import Script from 'next/script'


// export const metadata = {
//     title: "Create Next App",
//     description: "Generated by create next app",
// };
export async function generateMetadata({ params, searchParams }, parent) {
  const { data: tokenData } = await axios.post(
    "https://gateway.igloorooms.com/IRBE/Get_BE_Token",
    {}
  );
  const token = tokenData.My_Result;
  const domain = decodeURIComponent(params.domain).split('.')[0];
  const { data } = await axios.post(
    `https://gateway.igloorooms.com/IR/Get_Exposed_Property?Ticket=${token}`,
    {
      id: -1,
      language: "EN",
      perma_link: domain,
    }
  );
  const result = data.My_Result;
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
        <Script type="module" src="https://wb-cmp.igloorooms.com/be/dist/iglooroom/iglooroom.esm.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}

