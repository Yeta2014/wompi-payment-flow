import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import type { CustomerRepoPort, CustomerInput } from "../../../domain/ports/repositories/customer.repo.port"

@Injectable()
export class CustomerRepoPrisma implements CustomerRepoPort {
  constructor(private prisma: PrismaService) {}

  async upsertByEmail(input: CustomerInput) {
    return this.prisma.customer.upsert({
      where: { email: input.email },
      update: { fullName: input.fullName, phone: input.phone },
      create: input,
    })
  }
}