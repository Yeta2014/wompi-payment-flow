import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { resetTx } from "../features/transaction/transactionSlice"
import { resetCheckout } from "../features/checkout/checkoutSlice"
import { Page } from "../ui/Page"
import { Card, CardBody, CardHeader } from "../ui/Card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"

export function StatusPage() {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const tx = useAppSelector((s) => s.transaction)

  const status = tx.status ?? "PENDING"
  const tone = status === "APPROVED" ? "ok" : status === "DECLINED" ? "warn" : status === "ERROR" ? "bad" : "neutral"

  return (
    <Page title="Estado" subtitle="Resultado final del intento de pago." step={4} right={<Badge text={status} tone={tone as any} />}>
      <div className="max-w-2xl">
        <Card>
          <CardHeader title="Resultado" subtitle="Si fue APPROVED, el stock se descuenta. Si no, se mantiene." />
          <CardBody>
            <div className="space-y-2 text-zinc-300">
              {tx.transactionId && (
                <p>
                  <b>Transaction ID:</b> <span className="text-zinc-200">{tx.transactionId}</span>
                </p>
              )}
              {tx.error && <p className="text-red-300"><b>Error:</b> {tx.error}</p>}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  // dejamos el flujo listo para un intento nuevo
                  dispatch(resetTx())
                  dispatch(resetCheckout())
                  nav("/")
                }}
              >
                Volver al producto
              </Button>

              <Button variant="secondary" onClick={() => nav("/summary")}>
                Ver resumen
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Page>
  )
}