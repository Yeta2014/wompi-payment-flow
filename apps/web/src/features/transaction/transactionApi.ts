import { apiPost } from "../../shared/utils/api"

export async function createTransaction(payload: any) {
  return apiPost<{ transactionId: string }>("/transactions", payload)
}

export async function payTransaction(id: string, payload: any) {
  return apiPost<{ status: string; transactionId: string }>(`/transactions/${id}/pay`, payload)
}