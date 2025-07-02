import React from 'react'
import EmailHeader from '../components/EmailHeader'

export default function SystemHeader({ name }) {
    return (
        <EmailHeader source={"https://x.igloorooms.com/app-assets/images/logo/logo-dark.png"} alt={"Igloorooms"} title={name} />
    )
}
