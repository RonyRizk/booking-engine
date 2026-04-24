import React from 'react'
import { PrintDocument } from '../cl/components/print-document'
import { FiscalDocumentFooter } from '../cl/components/fiscal-document-footer'

export default function InvoicePreview({ booking, property }) {
    return (
        <PrintDocument>

            <FiscalDocumentFooter property={property} />

        </PrintDocument>
    )
}
