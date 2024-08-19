import { getExposedProperty } from '@/lib/actions';
import React from 'react'

export async function generateMetadata({ params }, parent) {
    const result = await getExposedProperty({ perma_link: "", aName: params.id });
    const previousImages = (await parent).openGraph?.images || [];
    const logo = result?.space_theme?.favicon
    return {
        title: `${result?.name}, ${result?.country?.name} - Book direct`,
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
export default function layout({ children }) {

    return (
        <>{children}</>
    )
}
