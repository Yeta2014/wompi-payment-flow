import { Transaction } from 'src/domain/estities/transaction.entity';

export interface TransactionRepoPort {
  createPending(
    input: Omit<Transaction, 'id' | 'status'>,
  ): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  update(id: string, patch: Partial<Transaction>): Promise<Transaction>;
  createMovement(
    productId: string,
    transactionId: string,
    qtyDelta: number,
    reason: string,
  ): Promise<void>;
}
