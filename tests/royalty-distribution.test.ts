import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for royalty payments and balances
const royaltyPayments = new Map()
const royaltyBalances = new Map()
let nextPaymentId = 0

// Mock functions to simulate contract behavior
function recordRoyaltyPayment(licenseId: number, amount: number) {
  const paymentId = nextPaymentId++
  royaltyPayments.set(paymentId, {
    licenseId,
    amount,
    paidAt: Date.now(),
    status: "recorded",
  })
  return paymentId
}

function distributeRoyalty(paymentId: number) {
  if (!royaltyPayments.has(paymentId)) {
    throw new Error("Payment not found")
  }
  const payment = royaltyPayments.get(paymentId)
  if (payment.status !== "recorded") {
    throw new Error("Payment already distributed")
  }
  payment.status = "distributed"
  royaltyPayments.set(paymentId, payment)
  
  // Simulate adding to licensor's balance
  const licensorBalance = royaltyBalances.get("mock-licensor-address") || 0
  royaltyBalances.set("mock-licensor-address", licensorBalance + payment.amount)
}

function getRoyaltyPayment(paymentId: number) {
  return royaltyPayments.get(paymentId)
}

function getRoyaltyBalance(owner: string) {
  return royaltyBalances.get(owner) || 0
}

describe("Royalty Distribution Contract", () => {
  beforeEach(() => {
    royaltyPayments.clear()
    royaltyBalances.clear()
    nextPaymentId = 0
  })
  
  it("should record a royalty payment", () => {
    const paymentId = recordRoyaltyPayment(0, 100)
    expect(paymentId).toBe(0)
    expect(royaltyPayments.size).toBe(1)
  })
  
  it("should distribute a royalty payment", () => {
    const paymentId = recordRoyaltyPayment(0, 100)
    distributeRoyalty(paymentId)
    const payment = getRoyaltyPayment(paymentId)
    expect(payment.status).toBe("distributed")
    expect(getRoyaltyBalance("mock-licensor-address")).toBe(100)
  })
  
  it("should get royalty payment details", () => {
    const paymentId = recordRoyaltyPayment(0, 100)
    const payment = getRoyaltyPayment(paymentId)
    expect(payment).toBeDefined()
    expect(payment.amount).toBe(100)
    expect(payment.status).toBe("recorded")
  })
  
  it("should throw an error when distributing non-existent payment", () => {
    expect(() => distributeRoyalty(999)).toThrow("Payment not found")
  })
  
  it("should throw an error when distributing already distributed payment", () => {
    const paymentId = recordRoyaltyPayment(0, 100)
    distributeRoyalty(paymentId)
    expect(() => distributeRoyalty(paymentId)).toThrow("Payment already distributed")
  })
})

