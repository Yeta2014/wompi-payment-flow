import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchProducts } from "../features/product/productSlice"
import { setProductId } from "../features/checkout/checkoutSlice"
import { resetTx } from "../features/transaction/transactionSlice"
import { Page } from "../ui/Page"
import { Card, CardBody, CardHeader } from "../ui/Card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { CheckoutModal } from "./CheckoutModal"

function moneyCOP(cents: number) {
  // cents aquí es “cents”; para mostrar bonito en COP
  const value = Math.round(cents) // si ya manejas cents reales
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value)
}

export function ProductPage() {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((s) => s.product)
  const tx = useAppSelector((s) => s.transaction)
  const checkout = useAppSelector((s) => s.checkout)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const selected = useMemo(() => items.find((p) => p.id === checkout.productId), [items, checkout.productId])

  return (
    <Page
      title="Producto"
      subtitle="Escoge un producto y paga con tarjeta. El stock se descuenta solo si el pago es aprobado."
      step={0}
      right={
        tx.status ? (
          <Badge
            text={`Último pago: ${tx.status}`}
            tone={tx.status === "APPROVED" ? "ok" : tx.status === "DECLINED" ? "warn" : tx.status === "ERROR" ? "bad" : "neutral"}
          />
        ) : null
      }
    >
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Catálogo" subtitle="Productos cargados por el owner (seed en DB)." />
            <CardBody>
              {loading && <p className="text-zinc-300">Cargando productos...</p>}
              {error && <p className="text-red-300">{error}</p>}

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                {items.map((p) => {
                  const stockTone = p.stock > 3 ? "ok" : p.stock > 0 ? "warn" : "bad"
                  return (
                    <div key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-lg">{p.name}</h3>
                          <p className="text-zinc-400 text-sm">{p.description}</p>
                        </div>
                        <Badge
                          text={p.stock > 0 ? `Stock: ${p.stock}` : "Sin stock"}
                          tone={stockTone as any}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-white font-bold">{moneyCOP(p.priceCents)}</p>

                        <Button
                          disabled={p.stock <= 0}
                          onClick={() => {
                            dispatch(setProductId(p.id))
                            // si cambias de producto, reinicia transacción previa
                            dispatch(resetTx())
                            setOpen(true)
                          }}
                        >
                          Pagar
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Tips de demo" subtitle="Para que el evaluador lo entienda rápido." />
            <CardBody>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• Tarjeta termina en <b>42</b> ⇒ <span className="text-emerald-300">APPROVED</span></li>
                <li>• Tarjeta termina en <b>00</b> ⇒ <span className="text-red-300">ERROR</span></li>
                <li>• Cualquier otra ⇒ <span className="text-yellow-200">DECLINED</span></li>
                <li>• El CVC no se persiste (seguridad).</li>
              </ul>
            </CardBody>
          </Card>

          {selected && (
            <Card>
              <CardHeader title="Seleccionado" subtitle="Esto se mantiene con Redux Persist." />
              <CardBody>
                <p className="font-semibold">{selected.name}</p>
                <p className="text-zinc-400 text-sm mt-1">{selected.description}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" onClick={() => setOpen(true)}>Editar checkout</Button>
                  <Button variant="ghost" onClick={() => dispatch(fetchProducts())}>Refrescar stock</Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {open && <CheckoutModal onClose={() => setOpen(false)} />}
    </Page>
  )
}