import { PrismaClient } from "@prisma/client/extension"

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.product.findFirst()
  if (existing) return

  await prisma.product.createMany({
    data: [
      {
        name: "Wompi Headphones",
        description: "Wireless headphones with noise cancellation.",
        priceCents: 99000,
        currency: "COP",
        stock: 10,
      },
      {
        name: "Wompi Keyboard",
        description: "Mechanical keyboard with RGB lighting.",
        priceCents: 149000,
        currency: "COP",
        stock: 7,
      },
    ],
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })