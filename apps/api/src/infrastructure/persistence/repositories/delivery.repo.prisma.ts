import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import type { DeliveryRepoPort, DeliveryInput } from "../../../domain/ports/repositories/delivery.repo.port"

@Injectable()
export class DeliveryRepoPrisma implements DeliveryRepoPort {
  constructor(private prisma: PrismaService) {}

  async create(input: DeliveryInput) {
    return this.prisma.delivery.create({ data: input })
  }
}