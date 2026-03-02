import { Injectable } from '@nestjs/common';
import { TransactionRepoPrisma } from '../../infrastructure/persistence/repositories/transaction.repo.prisma';

type Tx = Awaited<ReturnType<TransactionRepoPrisma['findById']>>;

@Injectable()
export class GetTransactionUC {
  constructor(private readonly transactions: TransactionRepoPrisma) {}

  async execute(id: string): Promise<Tx> {
    return this.transactions.findById(id);
  }
}
