import { Injectable } from "@nestjs/common"
import type { PaymentGatewayPort, ChargeRequest, ChargeResponse } from "../../../domain/ports/gateways/payment-gateway.port"

@Injectable()
export class PaymentGatewayMock implements PaymentGatewayPort {
  async charge(req: ChargeRequest): Promise<ChargeResponse> {
    // ⚠️ No loguear PAN/CVC
    const last2 = req.cardNumber.slice(-2)

    // Regla demo:
    // termina en 42 => APPROVED
    // termina en 00 => ERROR
    // resto => DECLINED
    if (last2 === "42") return { status: "APPROVED", reference: `MOCK-${Date.now()}` }
    if (last2 === "00") return { status: "ERROR", reference: `MOCK-${Date.now()}`, reason: "Gateway error" }
    return { status: "DECLINED", reference: `MOCK-${Date.now()}`, reason: "Insufficient funds" }
  }
}