import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'

export const wishlistService = {
  async fetch() {
    if (USE_MOCK) return mockResponse({ items: [] }, { latency: 150 })
    return apiClient.get(ENDPOINTS.wishlist)
  },
  async sync(productIds) {
    if (USE_MOCK) return mockResponse({ productIds }, { latency: 150 })
    return apiClient.put(ENDPOINTS.wishlist, { productIds })
  },
}

export default wishlistService
