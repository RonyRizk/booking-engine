/**
 * Document layout shells for all print documents.
 *
 * PrintDocument      — a fixed A4 page (595.28pt wide) with a 36pt margin, so the
 *                      screen preview and the PDF are the same document. On screen
 *                      it carries card chrome; in print that chrome is reset.
 * PrintDocumentState — centred loading / error placeholder inside a document
 */

import { cn } from '@/lib/utils';

// ─── PrintDocument ────────────────────────────────────────────────────────────
// wide — trade margin for content width (18pt instead of 36pt → 559.28pt of
//        content) for documents with many columns, e.g. the account statement.
//        A4 cannot get wider, so this is the only lever available.

export function PrintDocument({ children, wide, className }) {
  return (
    <div
      className={cn(
        'fiscal-page mx-auto w-page max-w-page bg-white rounded-lg shadow-lg print:rounded-none print:m-0 print:shadow-none print:ring-0',
        // vertical padding is dropped in print — @page supplies it on every page
        wide ? 'p-page-margin-tight print:py-0' : 'p-page-margin print:py-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── PrintDocumentState ───────────────────────────────────────────────────────
// variant: "default" | "error"

export function PrintDocumentState({ children, variant = 'default', className }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center min-h-[144pt] text-sm',
        variant === 'error' && 'text-red-600 font-medium',
        className,
      )}
    >
      {children}
    </div>
  );
}
