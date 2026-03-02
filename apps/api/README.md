# Backend — Payment Flow API
NestJS + Prisma + PostgreSQL

Este servicio implementa un flujo de compra con:

- Gestión de productos
- Creación de transacciones
- Simulación de pago (mock gateway)
- Control de inventario
- Arquitectura por capas (inspiración hexagonal)

---

# 🧱 Stack Tecnológico

- Node.js 20+
- NestJS
- Prisma ORM (v7)
- PostgreSQL (Docker)
- TypeScript
- Arquitectura por capas (Domain / Application / Infrastructure)

---

# 🏗 Arquitectura

Estructura conceptual:
src/
domain/
entities/
ports/
application/
use-cases/
infrastructure/
controllers/
persistence/
gateways/
app.module.ts

### 🔹 Domain
Contiene:
- Entidades puras
- Interfaces (puertos)
- Lógica de negocio independiente del framework

No depende de Nest ni Prisma.

---

### 🔹 Application
Contiene:
- Casos de uso (Use Cases)
- Orquestación del flujo de negocio

Ejemplo:
- CreateTransactionUC
- PayTransactionUC
- GetProductsUC

---

### 🔹 Infrastructure
Contiene:
- Controllers (Nest)
- Repositorios Prisma
- Implementación del gateway de pago mock

Aquí se conectan los puertos del dominio con el mundo real.

---

# 🔄 Flujo de Pago

1. GET /products
2. POST /transactions
3. POST /transactions/:id/pay
4. GET /transactions/:id

### Reglas del Mock Gateway

- Tarjeta termina en 42 → APPROVED
- Tarjeta termina en 00 → ERROR
- Cualquier otro → DECLINED

Solo en APPROVED:
- Se descuenta stock

---

# 🧬 Base de Datos

PostgreSQL vía Docker.

## Tablas principales

- Product
- Transaction
- Customer
- Delivery
- InventoryMovement

---

# ⚙️ Setup

## 1. Instalar dependencias
```bash
pnpm -C apps/api install