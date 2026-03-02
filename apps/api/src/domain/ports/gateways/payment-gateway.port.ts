export type ChargeRequest = {
  amountCents: number
  currency: string
  // NO almacenar PAN/CVC. Solo usar para enviar al gateway.
  cardNumber: string
  expMonth: string
  expYear: string
  cvc: string
  holderName: string
}

export type ChargeResponse =
  | { status: "APPROVED"; reference: string }
  | { status: "DECLINED"; reference: string; reason: string }
  | { status: "ERROR"; reference: string; reason: string }

export interface PaymentGatewayPort {
  charge(req: ChargeRequest): Promise<ChargeResponse>
}