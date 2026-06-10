export const ClTxTypeCode = {
  Payment: 'PAY',
  OpeningBalance: 'OB',
  Adjustment: 'ADJ',
  CreditNote: 'CN',
  DebitNote: 'DN',
  StandardChargeDebit: 'DB',
  Discount: 'DSC',
  CancellationPenalty: 'CPN',
};

export const FdTypes = {
  Draft: 'DFT',
  Invoice: 'INV',
  CreditNote: 'CN',
  DebitNote: 'DN',
  Receipt: 'REC',
  CreditReceipt: 'CREC',
};

export const ChargeSource = {
  ACCOMMODATION: 0,
  PICKUP: 1,
  EXTRA_SERVICE: 2,
};

export const PayMethodCode = {
  Cash: '001',
  OTAVirtualCard: '002',
  Online: '003',
  ManualCard: '004',
  MoneyTransfer: '005',
  BankDeposit: '006',
  BankTransfer: '007',
  BankCheck: '008',
  BankCash: '009',
};

export const VatIncludedCodes = {
  NotApplicable: '002',
  Inclusive: '001',
  Exclusive: '000',
};

export const FdStatus = {
  Sent: 'SENT',
  Viewed: 'VIEWED',
  Paid: 'PAID',
  Partial: 'PARTIAL',
  Issued: 'ISSUED',
  Voided: 'VOIDED',
};
