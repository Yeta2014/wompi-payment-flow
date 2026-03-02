import { Injectable } from '@nestjs/common';
import { Err, Ok, type Result } from '../rop/result';
import type { AppError } from '../rop/errors';
import { TransactionRepoPrisma } from '../../infrastructure/persistence/repositories/transaction.repo.prisma';
import { ProductRepoPrisma } from '../../infrastructure/persistence/repositories/product.repo.prisma';
import { PaymentGatewayMock } from '../../infrastructure/gateways/payment/payment.gateway.mock';

export type PayInput = {
  transactionId: string;
  card: {
    number: string;
    expMonth: string;
    expYear: string;
    cvc: string;
    holderName: string;
  };
};

type Tx = NonNullable<Awaited<ReturnType<TransactionRepoPrisma['findById']>>>;
type Product = NonNullable<Awaited<ReturnType<ProductRepoPrisma['findById']>>>;
type Charge = Awaited<ReturnType<PaymentGatewayMock['charge']>>;

@Injectable()
export class PayTransactionUC {
  constructor(
    private readonly transactions: TransactionRepoPrisma,
    private readonly products: ProductRepoPrisma,
    private readonly gateway: PaymentGatewayMock,
  ) {}

  async execute(
    input: PayInput,
  ): Promise<
    Result<
      { status: 'APPROVED' | 'DECLINED' | 'ERROR'; transactionId: string },
      AppError
    >> {
    const foundTx = await this.transactions.findById(input.transactionId);

    if (!foundTx) {
      return Err({ code: 'NOT_FOUND', message: 'Transaction not found' });
    }

    const tx: Tx = foundTx;

    if (tx.status !== 'PENDING') {
      return Err({
        code: 'INVALID_STATE',
        message: 'Transaction is not pending',
      });
    }

    const foundProduct = await this.products.findById(tx.productId);

    if (!foundProduct) {
      return Err({ code: 'NOT_FOUND', message: 'Product not found' });
    }

    const product: Product = foundProduct;

    if (product.stock <= 0) {
      return Err({ code: 'OUT_OF_STOCK', message: 'Product out of stock' });
    }

    const charge: Charge = await this.gateway.charge({
      amountCents: tx.totalCents,
      currency: 'COP',
      cardNumber: input.card.number,
      expMonth: input.card.expMonth,
      expYear: input.card.expYear,
      cvc: input.card.cvc,
      holderName: input.card.holderName,
    });

    if (charge.status === 'APPROVED') {
      await this.products.decrementStock(product.id, 1);
      await this.transactions.createMovement(product.id, tx.id, -1, 'PURCHASE');

      await this.transactions.update(tx.id, {
        status: 'APPROVED',
        providerReference: charge.reference,
        failureReason: null,
      });

      return Ok({ status: 'APPROVED', transactionId: tx.id });
    }

    const finalStatus: 'DECLINED' | 'ERROR' = charge.status === 'DECLINED' ? 'DECLINED' : 'ERROR';

    await this.transactions.update(tx.id, {
      status: finalStatus,
      providerReference: charge.reference,
      failureReason: charge.reason,
    });

    return Ok({ status: finalStatus, transactionId: tx.id });
  }
}