import { getExposedProperty } from '@/utils/actions';
import React from 'react'

export async function generateMetadata({ params }, parent) {
    const result = await getExposedProperty({ perma_link: "", aName: params.id });
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
        <>{children}</>
    )
}
