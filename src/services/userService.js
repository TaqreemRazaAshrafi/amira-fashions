import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'

/**
 * Account data that is not authentication: addresses, saved payment methods and
 * notification preferences.
 *
 * Against the mock backend these calls succeed and echo their input — the store
 * holds the records on the device. Against a real backend they are the source of
 * truth and the store becomes a cache, which is why every mutation returns the
 * saved record rather than relying on the caller's copy.
 */
export const userService = {
  async getAddresses() {
    if (USE_MOCK) return mockResponse({ items: [] }, { latency: 200 })
    return apiClient.get(ENDPOINTS.addresses)
  },

  async createAddress(address) {
    if (USE_MOCK) return mockResponse({ ...address, id: `addr_${Date.now()}` }, { latency: 400 })
    return apiClient.post(ENDPOINTS.addresses, address)
  },

  async updateAddress(id, patch) {
    if (USE_MOCK) return mockResponse({ id, ...patch }, { latency: 400 })
    return apiClient.patch(ENDPOINTS.address(id), patch)
  },

  async deleteAddress(id) {
    if (USE_MOCK) return mockResponse({ ok: true, id }, { latency: 300 })
    return apiClient.delete(ENDPOINTS.address(id))
  },

  async getPaymentMethods() {
    if (USE_MOCK) return mockResponse({ items: [] }, { latency: 200 })
    return apiClient.get(ENDPOINTS.paymentMethods)
  },
}

export default userService
