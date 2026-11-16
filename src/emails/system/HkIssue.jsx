import React from 'react'
import EmailContainer from '../components/EmailContainer'
import SystemHeader from './SystemHeader'
import EmailText from '../components/EmailText'

export default function HkIssue({
    issue,
    i18n,
    property,
    connectedMpo
}) {
    const { t, lang, dir } = i18n;
    return (
        <EmailContainer lang={lang} dir={dir} connectedMpo={connectedMpo}>
            <SystemHeader name={property?.name} connectedMpo={connectedMpo} />
            <EmailText><b>{t("Lcz_Unit")}:</b> {issue.unit?.name}</EmailText>
            {/* <EmailText>
                <b>Date:</b> {issue.date}
            </EmailText> */}
            <EmailText>
                <b>{t("Lcz_Housekeeper")}:</b> {issue.housekeeper_name}
            </EmailText>
            <EmailText>
                <b>{t("Lcz_Reporting")}:</b> {issue.description}
            </EmailText>
            {/* <EmailText>
                <b>Issue ID:</b> {issue.id} &nbsp;|&nbsp; <b>HKA ID:</b> {issue.hka_id}
            </EmailText> */}
        </EmailContainer>
    )
}
