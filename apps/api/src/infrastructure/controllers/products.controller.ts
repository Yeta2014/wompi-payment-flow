import { Controller, Get, Param } from '@nestjs/common';
import { GetProductsUC } from '../../aplication/use-cases/get-products.uc';
import { ProductRepoPrisma } from '../persistence/repositories/product.repo.prisma';

type ProductList = Awaited<ReturnType<GetProductsUC['execute']>>;
type ProductOne = Awaited<ReturnType<ProductRepoPrisma['findById']>>;

@Controller()
export class ProductsController {
  constructor(
    private readonly getProducts: GetProductsUC,
    private readonly products: ProductRepoPrisma,
  ) {}

  @Get('/products')
  async list(): Promise<ProductList> {
    return this.getProducts.execute();
  }

  @Get('/products/:id')
  async get(@Param('id') id: string): Promise<ProductOne> {
    return this.products.findById(id);
  }
}
