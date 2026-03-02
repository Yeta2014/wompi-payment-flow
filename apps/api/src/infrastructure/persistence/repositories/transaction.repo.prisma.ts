import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { TransactionRepoPort } from '../../../domain/ports/repositories/transaction.repo.port';

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

  createdAt?: Date;
  updatedAt?: Date;
};

@Injectable()
export class TransactionRepoPrisma implements TransactionRepoPort {
  constructor(private readonly prisma: PrismaService) {}

  createPending(
    input: Omit<Transaction, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.prisma.transaction.create({
      data: {
        ...input,
        status: 'PENDING',
      },
    });
  }

  findById(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  update(id: string, patch: Partial<Transaction>) {
    return this.prisma.transaction.update({
      where: { id },
      data: patch,
    });
  }

  async createMovement(
    productId: string,
    transactionId: string,
    qtyDelta: number,
    reason: string,
  ): Promise<void> {
    await this.prisma.inventoryMovement.create({
      data: { productId, transactionId, qtyDelta, reason },
    });
  }
}
