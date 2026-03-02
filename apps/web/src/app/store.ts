import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import productReducer from "../features/product/productSlice"
import checkoutReducer from "../features/checkout/checkoutSlice"
import transactionReducer from "../features/transaction/transactionSlice"

const checkoutPersistConfig = {
  key: "checkout",
  storage,
  // Persistimos progreso, PERO NO CVC
  blacklist: ["cardCvc"],
}

const rootReducer = combineReducers({
  product: productReducer,
  checkout: persistReducer(checkoutPersistConfig, checkoutReducer),
  transaction: transactionReducer,
})

const persistConfig = { key: "root", storage, whitelist: ["checkout", "transaction"] }
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false, // redux-persist
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch