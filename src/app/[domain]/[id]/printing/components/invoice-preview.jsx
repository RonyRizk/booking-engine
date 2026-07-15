import React from 'react'
import { PrintDocument } from '../shared/print-document'
import { FiscalDocumentFooter } from '../shared/fiscal-document-footer'

export default function InvoicePreview({ booking, property }) {
    return (
        <PrintDocument>

            <FiscalDocumentFooter property={property} />

        </PrintDocument>
    )
}
