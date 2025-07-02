import { Column, Row, Section } from '@react-email/components'
import React from 'react'
import EmailText from './EmailText'
import EmailLogo from './EmailLogo'

export default function EmailHeader({ children, source, alt, title }) {
    return (
        <Section style={{ margin: '0', padding: '0' }}>
            <Row>
                <Column>
                    {source && <EmailLogo src={source} alt={alt} />}
                    <EmailText variant='property'>{title}</EmailText>
                    {children}
                </Column>
            </Row>
        </Section>
    )
}
