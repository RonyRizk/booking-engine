/**
 * Renders the property's invoice footer notes.
 *
 * The HTML comes from the property record and is not controlled here, so the
 * wrapper constrains it to the A4 content box — an unconstrained table or image
 * in that field would otherwise widen the page.
 */
export function FiscalDocumentFooter({ property }) {
    if (!property?.company?.invoice_footer_notes) {
        return null
    }
    return (
        <div
            className="pt-[36pt] max-w-full break-words [&_*]:max-w-full [&_img]:h-auto [&_table]:w-full [&_table]:table-auto"
            dangerouslySetInnerHTML={{ __html: property.company.invoice_footer_notes }}
        />
    )
}
