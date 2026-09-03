import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'

/**
 * Gateway-agnostic payment surface.
 *
 * SECURITY: only the *publishable* key is ever read on the client. Order
 * amounts, signatures and capture all happen server-side — the browser
 * receives an opaque intent id and hands back a signature for the server to
 * verify. Never put a secret key in a VITE_ variable; it would be inlined into
 * the bundle and served to every visitor.
 */
const PUBLISHABLE_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

class PaymentService {
  constructor(provider = 'razorpay') {
    this.provider = provider
  }

  get isConfigured() {
    return Boolean(PUBLISHABLE_KEY) || USE_MOCK
  }

  /**
   * Asks the server to create a payment intent/order for the current cart.
   * The amount is recomputed server-side — the value sent here is advisory.
   */
  async createIntent({ amount, currency = 'INR', metadata = {} }) {
    if (USE_MOCK) {
      return mockResponse(
        {
          id: `intent_mock_${Math.random().toString(36).slice(2, 11)}`,
          provider: this.provider,
          amount,
          currency,
          status: 'created',
        },
        { latency: 600 }
      )
    }
    return apiClient.post(ENDPOINTS.paymentIntent, {
      amount,
      currency,
      provider: this.provider,
      metadata,
    })
  }

  /**
   * Opens the gateway's hosted checkout. Replace the mock branch with the
   * provider SDK call; the resolved shape must stay the same.
   */
  async openCheckout({ intent }) {
    if (USE_MOCK) {
      await mockResponse(null, { latency: 900 })
      return {
        paymentId: `pay_mock_${Math.random().toString(36).slice(2, 11)}`,
        intentId: intent.id,
        signature: 'mock_signature',
        status: 'authorized',
      }
    }

    // Production wiring (inert until the provider SDK script is loaded):
    //   const rzp = new window.Razorpay({ key: PUBLISHABLE_KEY, order_id: intent.id, ... })
    //   return new Promise((resolve, reject) => { rzp.on('payment.failed', reject); rzp.open() })
    throw new Error(
      'Payment gateway is not configured. Set VITE_RAZORPAY_KEY_ID and load the provider SDK.'
    )
  }

  /** Server verifies the signature and captures. Never trust the client result. */
  async verify(result) {
    if (USE_MOCK) return mockResponse({ verified: true, ...result }, { latency: 500 })
    return apiClient.post(ENDPOINTS.paymentVerify, result)
  }
}

export const paymentService = new PaymentService(
  import.meta.env.VITE_PAYMENT_PROVIDER || 'razorpay'
)
export default paymentService
