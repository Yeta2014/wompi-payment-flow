import { Injectable } from '@nestjs/common';
import { ProductRepoPrisma } from '../../infrastructure/persistence/repositories/product.repo.prisma';

@Injectable()
export class GetProductsUC {
  constructor(private products: ProductRepoPrisma) {}
  execute() {
    return this.products.findAll();
  }
}
