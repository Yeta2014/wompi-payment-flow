import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { CreateTransactionUC } from '../../aplication/use-cases/create-transaction.uc';
import { GetTransactionUC } from '../../aplication/use-cases/get-transaction.uc';
import { PayTransactionUC } from '../../aplication/use-cases/pay-transaction.uc';

const CreateSchema = z.object({
  productId: z.string().uuid(),
  customer: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
  }),
  delivery: z.object({
    addressLine: z.string().min(5),
    city: z.string().min(2),
    state: z.string().optional(),
    country: z.string().min(2),
    notes: z.string().optional(),
    deliveryFeeCents: z.number().int().nonnegative(),
  }),
});

const PaySchema = z.object({
  card: z.object({
    number: z.string().min(12),
    expMonth: z.string().min(1),
    expYear: z.string().min(2),
    cvc: z.string().min(3).max(4),
    holderName: z.string().min(2),
  }),
});

type CreateTxResult = Awaited<ReturnType<CreateTransactionUC['execute']>>;
type PayTxResult = Awaited<ReturnType<PayTransactionUC['execute']>>;
type Tx = Awaited<ReturnType<GetTransactionUC['execute']>>;

@Controller()
export class TransactionsController {
  constructor(
    private readonly createTx: CreateTransactionUC,
    private readonly payTx: PayTransactionUC,
    private readonly getTx: GetTransactionUC,
  ) {}

  @Post('/transactions')
  async create(
    @Body() body: unknown,
  ): Promise<
    CreateTxResult extends { ok: true; value: infer V } ? V : unknown
  > {
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      throw new HttpException(parsed.error.flatten(), HttpStatus.BAD_REQUEST);
    }

    const result: CreateTxResult = await this.createTx.execute(parsed.data);

    if (!result.ok) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Post('/transactions/:id/pay')
  async pay(
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<PayTxResult extends { ok: true; value: infer V } ? V : unknown> {
    const parsed = PaySchema.safeParse(body);
    if (!parsed.success) {
      throw new HttpException(parsed.error.flatten(), HttpStatus.BAD_REQUEST);
    }

    const result: PayTxResult = await this.payTx.execute({
      transactionId: id,
      card: parsed.data.card,
    });

    if (!result.ok) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get('/transactions/:id')
  async get(@Param('id') id: string): Promise<NonNullable<Tx>> {
    const tx = await this.getTx.execute(id);

    if (!tx) {
      throw new HttpException(
        { code: 'NOT_FOUND', message: 'Transaction not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return tx;
  }
}
