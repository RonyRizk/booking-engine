import React from 'react'
import EmailHeader from './EmailHeader'

export default function PropertyHeader({ children, property, useMpoLogo = false }) {
    return (
        <EmailHeader source={useMpoLogo ? property.mpo?.logo_url || property.space_theme.logo : property.space_theme.logo} title={property.name} alt={property.name}>
            {children}
        </EmailHeader>
    )
}
