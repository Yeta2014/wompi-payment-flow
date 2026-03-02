export type TransactionStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';

export type Transaction = {
  id: string;
  status: TransactionStatus;
  productId: string;
  customerId: string;
  deliveryId?: string | null;
  amountProductCents: number;
  baseFeeCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  providerReference?: string | null;
  failureReason?: string | null;
};
