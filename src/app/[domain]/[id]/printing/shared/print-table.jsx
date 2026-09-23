/**
 * Composable table primitives for print documents.
 *
 * Usage:
 *   <PrintTable>
 *     <PrintTableHead>
 *       <PrintTableRow>
 *         <PrintTableHeaderCell>Date</PrintTableHeaderCell>
 *         <PrintTableHeaderCell numeric>Amount</PrintTableHeaderCell>
 *       </PrintTableRow>
 *     </PrintTableHead>
 *     <PrintTableBody>
 *       <PrintTableRow variant="booking">
 *         <PrintTableCell colSpan={6}>#BK-001</PrintTableCell>
 *       </PrintTableRow>
 *       <PrintTableRow>
 *         <PrintTableCell muted nowrap>Jan 01, 2025</PrintTableCell>
 *         <PrintTableCell numeric bold>USD 100.00</PrintTableCell>
 *       </PrintTableRow>
 *       <PrintTableRow variant="balance">
 *         <PrintTableCell numeric bold colSpan={6}>USD 500.00</PrintTableCell>
 *       </PrintTableRow>
 *     </PrintTableBody>
 *   </PrintTable>
 *
 * Row variants: "default" | "booking" | "unit" | "balance"
 */

import { cn } from '@/lib/utils';

// ─── PrintTable ───────────────────────────────────────────────────────��───────

export function PrintTable({ children, className }) {
  return (
    <table className={cn('w-full max-w-full border-collapse table-auto text-base font-[system-ui,Arial,sans-serif]', className)}>
      {children}
    </table>
  );
}

// ─── PrintTableHead ───────────────────────────────────────────────────────────

export function PrintTableHead({ children, className }) {
  return <thead className={cn("", className)}>{children}</thead>;
}

// ─── PrintTableBody ───────────────────────────────────────────────────────────

export function PrintTableBody({ children, className }) {
  return <tbody className={cn("", className)}>{children}</tbody>;
}

// ─── PrintTableRow ────────────────────────────────────────────────────────────
// variant: "default" | "booking" | "unit" | "balance"

export function PrintTableRow({ children, variant = 'default', className }) {
  return (
    <tr
      className={cn(
        variant === 'booking' && 'bg-slate-50',
        variant === 'unit' && 'bg-slate-50/60',
        variant === 'balance' && 'bg-slate-100 border-t-2 border-t-slate-300',
        className,
      )}
    >
      {children}
    </tr>
  );
}

// ─── PrintTableHeaderCell ─────────────────────────────────────────────────────
// numeric — aligns text right for numeric columns

export function PrintTableHeaderCell({ children, numeric, className, style }) {
  return (
    <th
      style={style}
      className={cn(
        'py-[4pt] px-[6pt] text-left font-semibold uppercase tracking-normal text-slate-800 border-t-2 border-slate-300 border-b whitespace-normal break-words align-bottom print:py-[3pt]',
        numeric && 'text-right',
        className,
      )}
    >
      {children}
    </th>
  );
}

// ─── PrintTableCell ───────────────────────────────────────────────────────────
// numeric  — right-align + tabular nums
// muted    — gray text
// bold     — dark bold text
// nowrap   — no word wrap
// fill     — the flexible column (description): the one allowed to break
//            anywhere, so the table can shrink to the page instead of overflowing
// empty    — centered italic placeholder (for "no data" rows)
// indent   — 0 | 1 | 2  (visual indentation for nested rows)

export function PrintTableCell({
  children,
  numeric,
  muted,
  bold,
  nowrap,
  empty,
  fill,
  indent = 0,
  colSpan,
  className,
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        'px-[6pt] py-[3.5pt] font-normal align-top border-b border-slate-200 text-slate-700 break-words print:py-[2pt] print:pr-[4pt]',
        numeric && 'text-right tabular-nums',
        muted && 'text-slate-600',
        bold && 'font-semibold text-slate-900',
        nowrap && 'whitespace-nowrap',
        empty && 'text-center italic text-slate-600 py-[12pt]',
        fill && 'whitespace-normal [overflow-wrap:anywhere]',
        indent === 1 && 'pl-[16pt]',
        indent === 2 && 'pl-[28pt]',
        className,
      )}
    >
      {children}
    </td>
  );
}
