// src/domain/ports/repositories/product.repo.port.ts
import { Product } from 'src/domain/estities/product.entity';

export interface ProductRepoPort {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
}
