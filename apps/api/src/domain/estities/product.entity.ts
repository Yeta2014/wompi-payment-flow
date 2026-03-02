// src/domain/entities/product.entity.ts
export type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};
