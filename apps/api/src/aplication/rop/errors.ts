export type AppError =
  | { code: "NOT_FOUND"; message: string }
  | { code: "OUT_OF_STOCK"; message: string }
  | { code: "INVALID_STATE"; message: string }
  | { code: "PAYMENT_FAILED"; message: string }