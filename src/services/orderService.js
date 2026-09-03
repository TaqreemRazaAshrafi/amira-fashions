import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'
import paymentService from './paymentService'

const mockOrderNumber = () => `AF${Date.now().toString().slice(-8)}`

export const orderService = {
  /**
   * Full purchase flow: create the order, take payment, verify, confirm.
   * Each step is separately awaitable so the UI can report precise progress.
   */
  async place({ items, customer, address, delivery, totals, paymentMethod = 'online' }) {
    const draft = { items, customer, address, delivery, totals, paymentMethod }

    if (paymentMethod === 'cod') {
      return this.create({ ...draft, payment: { method: 'cod', status: 'pending' } })
    }

    const intent = await paymentService.createIntent({
      amount: totals.total,
      metadata: { email: customer.email },
    })
    const result = await paymentService.openCheckout({ intent, customer })
    const verification = await paymentService.verify(result)

    return this.create({
      ...draft,
      payment: { method: 'online', status: 'paid', reference: verification.paymentId },
    })
  },

  async create(order) {
    if (USE_MOCK) {
      return mockResponse(
        {
          id: mockOrderNumber(),
          ...order,
          status: 'confirmed',
          placedAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 5 * 864e5).toISOString(),
        },
        { latency: 700 }
      )
    }
    return apiClient.post(ENDPOINTS.orders, order)
  },

  async getById(id) {
    if (USE_MOCK) return mockResponse({ id, status: 'confirmed' })
    return apiClient.get(ENDPOINTS.order(id))
  },
}

export default orderService
