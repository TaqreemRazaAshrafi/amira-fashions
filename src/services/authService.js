import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'

const mockToken = (email) => `mock.${btoa(email).replace(/=/g, '')}.token`

/** Auth is intentionally thin — token storage is owned by the auth store. */
export const authService = {
  async login({ email, password }) {
    if (!USE_MOCK) return apiClient.post(ENDPOINTS.login, { email, password })

    await mockResponse(null, { latency: 700 })
    if (!password || password.length < 8) {
      const error = new Error('That email and password combination did not match our records.')
      error.code = 'invalid_credentials'
      throw error
    }
    return {
      token: mockToken(email),
      user: {
        id: 'user_mock',
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      },
    }
  },

  async register({ name, email, password }) {
    if (!USE_MOCK) return apiClient.post(ENDPOINTS.register, { name, email, password })
    await mockResponse(null, { latency: 800 })
    return {
      token: mockToken(email),
      user: { id: 'user_mock', email, name, createdAt: new Date().toISOString() },
    }
  },

  async logout() {
    if (USE_MOCK) return mockResponse({ ok: true }, { latency: 120 })
    return apiClient.post(ENDPOINTS.logout)
  },

  async me() {
    if (USE_MOCK) return mockResponse(null, { latency: 120 })
    return apiClient.get(ENDPOINTS.me)
  },
}

export default authService
