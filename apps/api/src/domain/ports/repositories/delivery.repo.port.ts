export type DeliveryInput = {
  customerId: string
  addressLine: string
  city: string
  state?: string
  country: string
  notes?: string
  deliveryFeeCents: number
}
export type Delivery = { id: string }

export interface DeliveryRepoPort {
  create(input: DeliveryInput): Promise<Delivery>
}