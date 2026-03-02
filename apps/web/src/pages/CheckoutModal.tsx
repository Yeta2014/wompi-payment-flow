import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { setCustomer, setDelivery, setCard } from "../features/checkout/checkoutSlice"
import { Card, CardBody, CardHeader } from "../ui/Card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"

function fieldCls() {
  return "w-full rounded-xl bg-zinc-950/40 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-500"
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function CheckoutModal({ onClose }: { onClose: () => void }) {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const checkout = useAppSelector((s) => s.checkout)

  const valid = useMemo(() => {
    return (
      checkout.customer.fullName.trim().length >= 2 &&
      isEmail(checkout.customer.email) &&
      checkout.customer.phone.trim().length >= 6 &&
      checkout.delivery.addressLine.trim().length >= 5 &&
      checkout.delivery.city.trim().length >= 2 &&
      checkout.cardHolderName.trim().length >= 2 &&
      checkout.cardNumber.replace(/\s/g, "").length >= 12 &&
      checkout.cardExpMonth.trim().length >= 1 &&
      checkout.cardExpYear.trim().length >= 2 &&
      checkout.cardCvc.trim().length >= 3
    )
  }, [checkout])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader title="Checkout" subtitle="Datos de cliente, envío y tarjeta (CVC no se persiste)." />
          <CardBody>
            <div className="flex items-center justify-between gap-3 mb-4">
              <Badge text={valid ? "Formulario válido" : "Faltan campos"} tone={valid ? "ok" : "warn"} />
              <Button variant="ghost" onClick={onClose}>Cerrar</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h3 className="font-semibold">Cliente</h3>
                <input
                  className={fieldCls()}
                  placeholder="Nombre completo"
                  value={checkout.customer.fullName}
                  onChange={(e) => dispatch(setCustomer({ ...checkout.customer, fullName: e.target.value }))}
                />
                <input
                  className={fieldCls()}
                  placeholder="Email"
                  value={checkout.customer.email}
                  onChange={(e) => dispatch(setCustomer({ ...checkout.customer, email: e.target.value }))}
                />
                <input
                  className={fieldCls()}
                  placeholder="Teléfono"
                  value={checkout.customer.phone}
                  onChange={(e) => dispatch(setCustomer({ ...checkout.customer, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Envío</h3>
                <input
                  className={fieldCls()}
                  placeholder="Dirección"
                  value={checkout.delivery.addressLine}
                  onChange={(e) => dispatch(setDelivery({ ...checkout.delivery, addressLine: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className={fieldCls()}
                    placeholder="Ciudad"
                    value={checkout.delivery.city}
                    onChange={(e) => dispatch(setDelivery({ ...checkout.delivery, city: e.target.value }))}
                  />
                  <input
                    className={fieldCls()}
                    placeholder="País (CO)"
                    value={checkout.delivery.country}
                    onChange={(e) => dispatch(setDelivery({ ...checkout.delivery, country: e.target.value }))}
                  />
                </div>
                <input
                  className={fieldCls()}
                  placeholder="Costo envío (cents)"
                  value={String(checkout.delivery.deliveryFeeCents ?? 0)}
                  onChange={(e) => dispatch(setDelivery({ ...checkout.delivery, deliveryFeeCents: Number(e.target.value || 0) }))}
                />
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h3 className="font-semibold">Tarjeta</h3>
                <input
                  className={fieldCls()}
                  placeholder="Nombre en tarjeta"
                  value={checkout.cardHolderName}
                  onChange={(e) =>
                    dispatch(setCard({ holderName: e.target.value, number: checkout.cardNumber, expMonth: checkout.cardExpMonth, expYear: checkout.cardExpYear, cvc: checkout.cardCvc }))
                  }
                />
                <input
                  className={fieldCls()}
                  placeholder="Número (termina 42 aprobado)"
                  value={checkout.cardNumber}
                  onChange={(e) =>
                    dispatch(setCard({ holderName: checkout.cardHolderName, number: e.target.value, expMonth: checkout.cardExpMonth, expYear: checkout.cardExpYear, cvc: checkout.cardCvc }))
                  }
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    className={fieldCls()}
                    placeholder="MM"
                    value={checkout.cardExpMonth}
                    onChange={(e) =>
                      dispatch(setCard({ holderName: checkout.cardHolderName, number: checkout.cardNumber, expMonth: e.target.value, expYear: checkout.cardExpYear, cvc: checkout.cardCvc }))
                    }
                  />
                  <input
                    className={fieldCls()}
                    placeholder="YY"
                    value={checkout.cardExpYear}
                    onChange={(e) =>
                      dispatch(setCard({ holderName: checkout.cardHolderName, number: checkout.cardNumber, expMonth: checkout.cardExpMonth, expYear: e.target.value, cvc: checkout.cardCvc }))
                    }
                  />
                  <input
                    className={fieldCls()}
                    placeholder="CVC"
                    value={checkout.cardCvc}
                    onChange={(e) =>
                      dispatch(setCard({ holderName: checkout.cardHolderName, number: checkout.cardNumber, expMonth: checkout.cardExpMonth, expYear: checkout.cardExpYear, cvc: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Continuar</h3>
                <p className="text-zinc-400 text-sm">
                  En la siguiente pantalla verás el breakdown (producto + base fee + envío) y podrás pagar.
                </p>

                <Button
                  className="w-full"
                  disabled={!valid}
                  onClick={() => {
                    onClose()
                    nav("/summary")
                  }}
                >
                  Ir a resumen
                </Button>

                <Button className="w-full" variant="secondary" onClick={onClose}>
                  Guardar y cerrar
                </Button>

                <div className="pt-2 text-xs text-zinc-500">
                  <p>Regla mock gateway:</p>
                  <p>• termina en 42 = APPROVED</p>
                  <p>• termina en 00 = ERROR</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}