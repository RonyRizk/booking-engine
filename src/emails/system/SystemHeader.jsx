import React from 'react'
import EmailHeader from '../components/EmailHeader'

export default function SystemHeader({ name, connectedMpo }) {
    const _baseUrl = "https://x.igloorooms.com/app-assets/images/logo/logo-dark.png";
    const _baseName = "Igloorooms"
    return (
        <EmailHeader source={connectedMpo?.logo_url || _baseUrl} alt={connectedMpo?.name || _baseName} title={name} />
    )
}
