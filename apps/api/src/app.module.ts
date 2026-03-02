import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';
import { ProductRepoPrisma } from './infrastructure/persistence/repositories/product.repo.prisma';
import { CustomerRepoPrisma } from './infrastructure/persistence/repositories/customer.repo.prisma';
import { DeliveryRepoPrisma } from './infrastructure/persistence/repositories/delivery.repo.prisma';
import { TransactionRepoPrisma } from './infrastructure/persistence/repositories/transaction.repo.prisma';
import { PaymentGatewayMock } from './infrastructure/gateways/payment/payment.gateway.mock';

// ✅ OJO: tu carpeta es "aplication", no "application"
import { GetProductsUC } from './aplication/use-cases/get-products.uc';
import { CreateTransactionUC } from './aplication/use-cases/create-transaction.uc';
import { PayTransactionUC } from './aplication/use-cases/pay-transaction.uc';
import { GetTransactionUC } from './aplication/use-cases/get-transaction.uc';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ProductsController, TransactionsController],
  providers: [
    PrismaService,

    // Repos
    ProductRepoPrisma,
    CustomerRepoPrisma,
    DeliveryRepoPrisma,
    TransactionRepoPrisma,

    // Gateway
    PaymentGatewayMock,

    // Use cases
    GetProductsUC,
    CreateTransactionUC,
    PayTransactionUC,
    GetTransactionUC,
  ],
})
export class AppModule {}
