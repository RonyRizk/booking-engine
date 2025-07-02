import { Link } from '@react-email/components'
import React from 'react'

export default function EmailLink({ style, ...props }) {
    return (
        <Link {...props} style={{ ...styles.link, ...style }}></Link>
    )
}
const styles = {
    link: {
        "color": "#2196f3",
        textDecoration: "underline"
    }
}
