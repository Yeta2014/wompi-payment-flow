import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiGet } from "../../shared/utils/api"

export type Product = {
  id: string
  name: string
  description: string
  priceCents: number
  currency: string
  stock: number
}

export const fetchProducts = createAsyncThunk("product/fetchProducts", async () => {
  return apiGet<Product[]>("/products")
})

type State = { items: Product[]; loading: boolean; error?: string }
const initialState: State = { items: [], loading: false }

const slice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (s) => {
        s.loading = true
        s.error = undefined
      })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false
        s.items = a.payload
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.loading = false
        s.error = a.error.message
      })
  },
})

export default slice.reducer