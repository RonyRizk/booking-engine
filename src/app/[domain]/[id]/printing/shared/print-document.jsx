/**
 * Document layout shells for all print documents.
 *
 * PrintDocument      — white card with shadow (900 px default, 960 px when wide)
 * PrintDocumentState — centred loading / error placeholder inside a document
 */

import { cn } from '@/lib/utils';

// ─── PrintDocument ────────────────────────────────────────────────────────────
// wide — use 960 px max-width (e.g. for statement). Default: 900 px.

export function PrintDocument({ children, wide, className }) {
  return (
    <div
      className={cn(
        'mx-auto bg-white rounded-lg p-8 shadow-lg  print:rounded-none print:m-0 print:w-full print:max-w-full print:shadow-none print:ring-0',
        wide ? 'max-w-[960px]' : 'max-w-[900px]',
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
        'flex items-center justify-center min-h-[200px] text-sm',
        variant === 'error' && 'text-red-600 font-medium',
        className,
      )}
    >
      {children}

    </div>
  );
}
