export type CustomerInput = { fullName: string; email: string; phone: string }
export type Customer = { id: string; fullName: string; email: string; phone: string }

export interface CustomerRepoPort {
  upsertByEmail(input: CustomerInput): Promise<Customer>
}