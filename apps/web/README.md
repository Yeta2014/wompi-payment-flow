
---

# ✅ `apps/web/README.md` (Frontend — Versión Profesional)

```md
# Frontend — Payment Flow UI
React + Vite + Tailwind v4

Implementa el flujo visual completo:

1. Producto
2. Checkout
3. Resumen
4. Pago
5. Estado

---

# 🧱 Stack

- React 18
- Vite
- TypeScript
- Tailwind v4
- React Router

Opcional:
- Redux Toolkit
- Redux Persist

---

# 🧭 Arquitectura Frontend
src/
pages/
routes/
shared/ui/
app/

---

## Pages

- ProductPage
- SummaryPage
- StatusPage
- CheckoutModal

Cada pantalla representa una etapa del flujo.

---

## Router

AppRouter define:

- `/`
- `/summary`
- `/status`

---

# 🎨 UI

Tailwind v4

En `index.css`:

```css
@import "tailwindcss";