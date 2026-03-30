import React from 'react'
import EmailContainer from '../components/EmailContainer'
import SystemHeader from './SystemHeader'
import EmailText from '../components/EmailText'

export default function HkIssue({
    issue,
    lang,
    property,
    connectedMpo
}) {
    return (
        <EmailContainer lang={lang} connectedMpo={connectedMpo}>
            <SystemHeader name={property?.name} connectedMpo={connectedMpo} />
            <EmailText><b>Unit:</b> {issue.unit_name}</EmailText>
            {/* <EmailText>
                <b>Date:</b> {issue.date}
            </EmailText> */}
            <EmailText>
                <b>Housekeeper:</b> {issue.housekeeper_name}
            </EmailText>
            <EmailText>
                <b>Reporting:</b> {issue.description}
            </EmailText>
            {/* <EmailText>
                <b>Issue ID:</b> {issue.id} &nbsp;|&nbsp; <b>HKA ID:</b> {issue.hka_id}
            </EmailText> */}
        </EmailContainer>
    )
}
