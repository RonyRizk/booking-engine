export function FiscalDocumentFooter({ property }) {
    if (!property?.company?.invoice_footer_notes) {
        return null
    }
    return <div className="pt-14" dangerouslySetInnerHTML={{ __html: property.company.invoice_footer_notes }}></div>
}
