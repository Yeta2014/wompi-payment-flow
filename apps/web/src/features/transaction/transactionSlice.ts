import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

type TxState = {
  transactionId?: string
  status?: "PENDING" | "APPROVED" | "DECLINED" | "ERROR"
  error?: string
}

const initialState: TxState = {}

const slice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactionId(s, a: PayloadAction<string>) {
      s.transactionId = a.payload
    },
    setStatus(s, a: PayloadAction<TxState["status"]>) {
      s.status = a.payload
    },
    setError(s, a: PayloadAction<string | undefined>) {
      s.error = a.payload
    },
    resetTx() {
      return initialState
    },
  },
})

export const { setTransactionId, setStatus, setError, resetTx } = slice.actions
export default slice.reducer