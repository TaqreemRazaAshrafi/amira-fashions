import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'
import { instagramPosts } from '../data/instagram'

export const marketingService = {
  async subscribe(email) {
    if (USE_MOCK) return mockResponse({ email, subscribed: true }, { latency: 900 })
    return apiClient.post(ENDPOINTS.newsletter, { email })
  },

  async sendContactMessage(payload) {
    if (USE_MOCK) return mockResponse({ received: true, ...payload }, { latency: 1000 })
    return apiClient.post(ENDPOINTS.contact, payload)
  },

  /** Instagram Basic Display feed; mocked from local data in development. */
  async getInstagramFeed(limit = 8) {
    if (USE_MOCK) return mockResponse(instagramPosts.slice(0, limit), { latency: 400 })
    return apiClient.get(ENDPOINTS.instagram, { params: { limit } })
  },
}

export default marketingService
