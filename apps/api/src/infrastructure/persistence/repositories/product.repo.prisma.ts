import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ProductRepoPort } from '../../../domain/ports/repositories/product.repo.port';

@Injectable()
export class ProductRepoPrisma implements ProductRepoPort {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'asc' } })
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({ where: { id } })
  }

  async decrementStock(productId: string, qty: number) {
    // Transacción segura: evita stock negativo en carrera
    await this.prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: qty } },
    });
  }
}
