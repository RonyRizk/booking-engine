import { formatAmount } from '@/lib/utils';
import { getI18n } from '@/lib/printing-i18n';
import { DocumentHeader } from './document-header';
import { PrintDocument } from '../../shared/print-document';
import { FiscalDocumentFooter } from '../../shared/fiscal-document-footer';
import { ReceiptRow, ReceiptSection } from '../../shared/receipt-blocks';

// ─── ReceiptPreview ───────────────────────────────────────────────────────────

export function ReceiptPreview({ property, clEntry, document, paymentMethods, documentNumber, agent }) {
  const { t, lang } = getI18n();
  if (!clEntry) return <div>{t('Lcz_MissingDocument_X', documentNumber)}</div>;

  const currency = property?.currency?.symbol ?? '$';
  const fmt = v => (v != null ? formatAmount(v, currency) : formatAmount(0, currency));
  const getPaymentLabel = code => {
    if (!code) return '—';
    const method = paymentMethods?.find(e => e.CODE_NAME === code);
    return method?.[`CODE_VALUE_${lang.toUpperCase()}`] || method?.CODE_VALUE_EN || code;
  };

  return (
    <PrintDocument>
      <DocumentHeader
        documentType="receipt"
        property={property}
        documentNumber={documentNumber}
        agent={agent}
        className="mb-7"
      />

      <div className="flex flex-col gap-7">
        <ReceiptSection title={t('Lcz_PaymentDetails')}>
          <ReceiptRow label={t('Lcz_AmountReceived')} value={fmt(clEntry.TOTAL_AMOUNT)} />
          <ReceiptRow label={t('Lcz_PaymentMethod')} value={getPaymentLabel(clEntry.PAY_METHOD_CODE)} />
          {clEntry.DESCRIPTION && (
            <ReceiptRow label={t('Lcz_Reference')} value={clEntry.DESCRIPTION} />
          )}
        </ReceiptSection>

        <ReceiptSection title={t('Lcz_BalanceSummaryAccount')}>
          <ReceiptRow label={t('Lcz_BalanceBeforePayment')} value={fmt(document?.BALANCE_BEFORE_TX)} />
          <ReceiptRow label={t('Lcz_PaymentReceived')} value={fmt(clEntry.TOTAL_AMOUNT)} />
          <ReceiptRow label={t('Lcz_BalanceAfterPayment')} value={fmt(document?.BALANCE_AFTER_TX)} />
        </ReceiptSection>
      </div>
      <FiscalDocumentFooter property={property} />
    </PrintDocument>
  );
}
