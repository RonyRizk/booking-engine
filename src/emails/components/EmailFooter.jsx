import React from 'react'
import { Section } from "@react-email/components";

export default function EmailFooter({ children, style, ...props }) {
    return (
        <Section {...props} style={{ ...styles.footer, ...style }}>
            {children}
        </Section>

    )
}
const styles = {
    footer: { marginTop: "20px", width: "100%" },
}
