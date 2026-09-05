import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'
import paymentService from './paymentService'

const mockOrderNumber = () => `AF${Date.now().toString().slice(-8)}`

/** Fulfilment stages, in the order an order passes through them. */
export const ORDER_STATUSES = ['confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered']

export const ORDER_STATUS_LABELS = {
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

/**
 * Derives the tracking timeline from the order's placement date.
 *
 * Against a real backend this comes from the carrier; here it is computed so the
 * order page shows a coherent, monotonic timeline rather than invented events
 * that contradict the order's own age.
 */
export function trackingFor(order) {
  const placed = new Date(order.placedAt).getTime()
  const elapsedDays = (Date.now() - placed) / 864e5

  const schedule = [
    { status: 'confirmed', afterDays: 0, label: 'Order confirmed' },
    { status: 'processing', afterDays: 1, label: 'Packed at the studio' },
    { status: 'shipped', afterDays: 2, label: 'Handed to the carrier' },
    { status: 'out-for-delivery', afterDays: 4, label: 'Out for delivery' },
    { status: 'delivered', afterDays: 5, label: 'Delivered' },
  ]

  const steps = schedule.map((step) => ({
    ...step,
    at: new Date(placed + step.afterDays * 864e5).toISOString(),
    complete: order.status !== 'cancelled' && elapsedDays >= step.afterDays,
  }))

  const current = [...steps].reverse().find((step) => step.complete)
  return { steps, currentStatus: order.status === 'cancelled' ? 'cancelled' : (current?.status ?? 'confirmed') }
}

export const orderService = {
  /**
   * Full purchase flow: create the order, take payment, verify, confirm.
   * Each step is separately awaitable so the UI can report precise progress.
   */
  async place({ items, customer, address, delivery, totals, paymentMethod = 'online', coupon }) {
    const draft = { items, customer, address, delivery, totals, paymentMethod, coupon }

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
      payment: { method: paymentMethod, status: 'paid', reference: verification.paymentId },
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

  /**
   * Order history.
   *
   * There is no server-side order store behind the mock adapter, so the caller
   * passes the orders it already holds (from `orderStore`) and this returns them
   * in the response shape a real `GET /orders` would use. Against a live backend
   * the argument is ignored and the server is the source of truth.
   */
  async list({ localOrders = [] } = {}) {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.orders)
    const items = [...localOrders].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
    return mockResponse({ items, total: items.length }, { latency: 320 })
  },

  async getById(id, { localOrders = [] } = {}) {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.order(id))
    const order = localOrders.find((o) => o.id === id)
    if (!order) {
      return mockResponse(null, { latency: 200 }).then(() => {
        const error = new Error('We could not find that order.')
        error.code = 'not_found'
        error.status = 404
        throw error
      })
    }
    return mockResponse(order, { latency: 320 })
  },

  async getTracking(id, { order } = {}) {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.orderTracking(id))
    if (!order) return mockResponse({ steps: [], currentStatus: 'confirmed' }, { latency: 200 })
    return mockResponse(trackingFor(order), { latency: 300 })
  },
}

export default orderService
