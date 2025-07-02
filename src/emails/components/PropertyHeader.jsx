import React from 'react'
import EmailHeader from './EmailHeader'

export default function PropertyHeader({ children, property }) {
    return (
        <EmailHeader source={property.space_theme.logo} title={property.name} alt={property.name}>
            {children}
        </EmailHeader>
    )
}
