import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

type CheckoutState = {
  productId?: string
  customer: { fullName: string; email: string; phone: string }
  delivery: { addressLine: string; city: string; state?: string; country: string; notes?: string; deliveryFeeCents: number }
  // Solo datos “safe”
  cardHolderName: string
  cardNumber: string
  cardExpMonth: string
  cardExpYear: string
  cardCvc: string // NO persistimos
}

const initialState: CheckoutState = {
  customer: { fullName: "", email: "", phone: "" },
  delivery: { addressLine: "", city: "", state: "", country: "CO", notes: "", deliveryFeeCents: 12000 },
  cardHolderName: "",
  cardNumber: "",
  cardExpMonth: "",
  cardExpYear: "",
  cardCvc: "",
}

const slice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setProductId(s, a: PayloadAction<string>) {
      s.productId = a.payload
    },
    setCustomer(s, a: PayloadAction<CheckoutState["customer"]>) {
      s.customer = a.payload
    },
    setDelivery(s, a: PayloadAction<CheckoutState["delivery"]>) {
      s.delivery = a.payload
    },
    setCard(s, a: PayloadAction<{ holderName: string; number: string; expMonth: string; expYear: string; cvc: string }>) {
      s.cardHolderName = a.payload.holderName
      s.cardNumber = a.payload.number
      s.cardExpMonth = a.payload.expMonth
      s.cardExpYear = a.payload.expYear
      s.cardCvc = a.payload.cvc
    },
    clearSensitive(s) {
      s.cardCvc = ""
    },
    resetCheckout() {
      return initialState
    },
  },
})

export const { setProductId, setCustomer, setDelivery, setCard, clearSensitive, resetCheckout } = slice.actions
export default slice.reducer