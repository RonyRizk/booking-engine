/* eslint-disable @next/next/no-img-element */
import React from 'react'

export default function PropertyInfo({ property }) {
    return (
        <div className='flex flex-col items-end'>
            <p className='font-bold'>{property.name}</p>
            <p className='font-regular'>{[property?.city.name || null, property?.country.name || null].filter(f => f !== null).join(', ')}</p>
            <img
                src={property.space_theme.logo}
                alt="logo"
                className="aspect-1 h-10"
            />
        </div>
    )
}
