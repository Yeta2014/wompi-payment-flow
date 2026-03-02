import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ok, Err, type Result } from '../rop/result';
import type { AppError } from '../rop/errors';

import { ProductRepoPrisma } from '../../infrastructure/persistence/repositories/product.repo.prisma';
import { CustomerRepoPrisma } from '../../infrastructure/persistence/repositories/customer.repo.prisma';
import { DeliveryRepoPrisma } from '../../infrastructure/persistence/repositories/delivery.repo.prisma';
import { TransactionRepoPrisma } from '../../infrastructure/persistence/repositories/transaction.repo.prisma';


export type CreateTransactionInput = {
  productId: string;
  customer: { fullName: string; email: string; phone: string };
  delivery: {
    addressLine: string;
    city: string;
    state?: string;
    country: string;
    notes?: string;
    deliveryFeeCents: number;
  };
};

@Injectable()
export class CreateTransactionUC {
  constructor(
    private readonly config: ConfigService,
    private readonly products: ProductRepoPrisma,
    private readonly customers: CustomerRepoPrisma,
    private readonly deliveries: DeliveryRepoPrisma,
    private readonly transactions: TransactionRepoPrisma,
  ) {}

  async execute(
    input: CreateTransactionInput,
  ): Promise<Result<{ transactionId: string }, AppError>> {
    const product = await this.products.findById(input.productId);
    if (!product)
      return Err({ code: 'NOT_FOUND', message: 'Product not found' });

    if (product.stock <= 0)
      return Err({ code: 'OUT_OF_STOCK', message: 'Product out of stock' });

    const baseFeeCents = Number(this.config.get('BASE_FEE_CENTS') ?? 300);
    const amountProductCents = product.priceCents;
    const deliveryFeeCents = input.delivery.deliveryFeeCents;
    const totalCents = amountProductCents + baseFeeCents + deliveryFeeCents;

    const customer = await this.customers.upsertByEmail(input.customer);
    const delivery = await this.deliveries.create({
      customerId: customer.id,
      ...input.delivery,
    });

    const tx = await this.transactions.createPending({
      productId: product.id,
      customerId: customer.id,
      deliveryId: delivery.id,
      amountProductCents,
      baseFeeCents,
      deliveryFeeCents,
      totalCents,
      providerReference: null,
      failureReason: null,
    });

    return Ok({ transactionId: tx.id });
  }
}
