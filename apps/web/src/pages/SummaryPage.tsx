import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { createTransaction, payTransaction } from "../features/transaction/transactionApi"
import { setError, setStatus, setTransactionId } from "../features/transaction/transactionSlice"
import { clearSensitive } from "../features/checkout/checkoutSlice"
import { Page } from "../ui/Page"
import { Card, CardBody, CardHeader } from "../ui/Card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"

const BASE_FEE_CENTS = 300

function line(label: string, value: number) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-300">{label}</span>
      <span className="font-semibold">{value} cents</span>
    </div>
  )
}

export function SummaryPage() {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const checkout = useAppSelector((s) => s.checkout)
  const tx = useAppSelector((s) => s.transaction)
  const product = useAppSelector((s) => s.product.items.find((p) => p.id === checkout.productId))
  const [loading, setLoading] = useState(false)

  const totals = useMemo(() => {
    const amountProductCents = product?.priceCents ?? 0
    const deliveryFeeCents = checkout.delivery.deliveryFeeCents ?? 0
    const totalCents = amountProductCents + BASE_FEE_CENTS + deliveryFeeCents
    return { amountProductCents, deliveryFeeCents, totalCents }
  }, [product, checkout.delivery.deliveryFeeCents])

  if (!product) {
    return (
      <Page title="Resumen" subtitle="No hay producto seleccionado." step={2}>
        <Card>
          <CardBody>
            <p className="text-zinc-300">Regresa a producto y selecciona uno.</p>
            <div className="mt-4">
              <Button onClick={() => nav("/")}>Volver</Button>
            </div>
          </CardBody>
        </Card>
      </Page>
    )
  }

  async function onPay() {
    try {
      setLoading(true)
      dispatch(setError(undefined))
      dispatch(setStatus("PENDING"))

      const payload = {
        productId: product!.id,
        customer: checkout.customer,
        delivery: checkout.delivery,
      }

      let transactionId = tx.transactionId
      if (!transactionId) {
        const created = await createTransaction(payload)
        transactionId = created.transactionId
        dispatch(setTransactionId(transactionId))
      }

      const paid = await payTransaction(transactionId!, {
        card: {
          number: checkout.cardNumber,
          expMonth: checkout.cardExpMonth,
          expYear: checkout.cardExpYear,
          cvc: checkout.cardCvc,
          holderName: checkout.cardHolderName,
        },
      })

      dispatch(clearSensitive())
      dispatch(setStatus(paid.status as any))
      nav("/status")
    } catch (e: any) {
      dispatch(setStatus("ERROR"))
      dispatch(setError(e?.message ?? "Unknown error"))
      nav("/status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page title="Resumen" subtitle="Revisa el breakdown antes de pagar." step={2} right={tx.transactionId ? <Badge text="Tx creada" tone="neutral" /> : null}>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Breakdown" subtitle="El backend recalcula totales (no confiamos en FE)." />
            <CardBody>
              <div className="space-y-2">
                {line(product.name, totals.amountProductCents)}
                {line("Base fee", BASE_FEE_CENTS)}
                {line("Delivery fee", totals.deliveryFeeCents)}
                <hr className="border-zinc-800 my-2" />
                {line("Total", totals.totalCents)}
              </div>

              <div className="mt-5 flex gap-3">
                <Button disabled={loading} onClick={onPay}>
                  {loading ? "Procesando..." : "Pagar ahora"}
                </Button>
                <Button variant="secondary" onClick={() => nav("/")}>
                  Volver
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Datos guardados" subtitle="Persisten en refresh (sin CVC)." />
            <CardBody>
              <div className="text-sm text-zinc-300 space-y-2">
                <p><b>Cliente:</b> {checkout.customer.fullName || "—"}</p>
                <p><b>Email:</b> {checkout.customer.email || "—"}</p>
                <p><b>Envío:</b> {checkout.delivery.addressLine || "—"}, {checkout.delivery.city || "—"}</p>
                <p><b>Tarjeta:</b> •••• {checkout.cardNumber.slice(-4) || "—"}</p>
              </div>
              <div className="mt-4">
                <Button className="w-full" variant="secondary" onClick={() => nav("/")}>
                  Editar checkout
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Page>
  )
}