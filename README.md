# 🧾 Wompi FullStack Payment Flow

Implementación de un flujo de pago FullStack con arquitectura desacoplada, persistencia real y simulación de gateway de pago.

Este proyecto demuestra:

- Diseño de arquitectura limpia en backend
- Persistencia con PostgreSQL + Prisma
- Flujo UX completo en frontend
- Simulación de pasarela de pagos
- Control de inventario seguro
- Separación clara de responsabilidades

---

# 🏗 Arquitectura General

Monorepo gestionado con pnpm workspace.


.
├─ apps/
│ ├─ api/ → Backend (NestJS + Prisma + PostgreSQL)
│ └─ web/ → Frontend (React + Vite + Tailwind v4)
├─ docker-compose.yml
├─ pnpm-workspace.yaml
└─ package.json


---

# 🧱 Stack Tecnológico

## Backend
- NestJS
- Prisma ORM (v7)
- PostgreSQL
- Arquitectura por capas (Domain / Application / Infrastructure)
- Patrón ROP (Result Oriented Programming)
- Mock Payment Gateway desacoplado

## Frontend
- React 18
- Vite
- TypeScript
- Tailwind v4
- React Router
- Redux Toolkit

---

# ⚙️ Requisitos

- Node.js 20+
- pnpm 10+
- Docker Desktop

---

# 🚀 Instalación

Desde la raíz del proyecto:

```bash
pnpm install

Si pnpm bloquea scripts:

pnpm approve-builds
🐳 Base de Datos

Levantar PostgreSQL:

docker compose up -d
