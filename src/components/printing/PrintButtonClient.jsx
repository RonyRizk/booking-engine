"use client";

/**
 * The browser half of `PrintButton`: opens the browser's print dialog.
 *
 * Floats in the bottom corner on the document's start side (left in LTR, right in
 * RTL). A fixed element resolves `start` against its own direction, hence `dir`
 * on the button itself. `print:hidden` keeps it off the paper and out of the PDF.
 */
export default function PrintButtonClient({ label, dir }) {
    return (
        <button
            type="button"
            dir={dir}
            onClick={() => window.print()}
            className="fixed bottom-4 start-4 z-50 print:hidden inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9V3h12v6" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <path d="M6 14h12v7H6z" />
            </svg>
            {label}
        </button>
    );
}
