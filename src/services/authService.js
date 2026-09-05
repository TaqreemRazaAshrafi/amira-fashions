import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'

const mockToken = (email) => `mock.${btoa(email).replace(/=/g, '')}.token`

/** Raises an error shaped like the one `api/client` normalises server errors to. */
function authError(message, code, status = 400) {
  const error = new Error(message)
  error.code = code
  error.status = status
  return error
}

const mockUser = ({ email, name, phone }) => ({
  id: 'user_mock',
  email,
  name: name ?? email.split('@')[0],
  phone: phone ?? null,
  createdAt: new Date().toISOString(),
})

/** Auth is intentionally thin — token storage is owned by the auth store. */
export const authService = {
  /** `identifier` accepts either an email or a 10-digit Indian mobile number. */
  async login({ identifier, email, password }) {
    const login = identifier ?? email
    if (!USE_MOCK) return apiClient.post(ENDPOINTS.login, { identifier: login, password })

    await mockResponse(null, { latency: 700 })
    if (!password || password.length < 8) {
      throw authError(
        'That email and password combination did not match our records.',
        'invalid_credentials',
        401
      )
    }
    const isPhone = /^\d{10}$/.test(login)
    return {
      token: mockToken(login),
      user: mockUser({
        email: isPhone ? `${login}@mobile.local` : login,
        phone: isPhone ? login : null,
      }),
    }
  },

  async register({ name, email, phone, password }) {
    if (!USE_MOCK) return apiClient.post(ENDPOINTS.register, { name, email, phone, password })
    await mockResponse(null, { latency: 800 })
    return { token: mockToken(email), user: mockUser({ email, name, phone }) }
  },

  async logout() {
    if (USE_MOCK) return mockResponse({ ok: true }, { latency: 120 })
    return apiClient.post(ENDPOINTS.logout)
  },

  async me() {
    if (USE_MOCK) return mockResponse(null, { latency: 120 })
    return apiClient.get(ENDPOINTS.me)
  },

  async updateProfile(patch) {
    if (!USE_MOCK) return apiClient.patch(ENDPOINTS.profile, patch)
    await mockResponse(null, { latency: 500 })
    return patch
  },

  /**
   * Starts a password reset.
   *
   * The response deliberately does not reveal whether the account exists — that
   * would turn this endpoint into an account-enumeration oracle.
   */
  async forgotPassword({ identifier }) {
    if (!USE_MOCK) return apiClient.post(ENDPOINTS.forgotPassword, { identifier })
    await mockResponse(null, { latency: 900 })
    return {
      ok: true,
      // A real backend decides the channel; the UI branches on this, not on input shape.
      channel: /^\d{10}$/.test(identifier) ? 'sms' : 'email',
      message: 'If an account exists for that address, a reset code is on its way.',
    }
  },

  /** OTP step. Mock accepts any 6 digits so the flow is walkable end to end. */
  async verifyOtp({ identifier, otp }) {
    if (!USE_MOCK) return apiClient.post(ENDPOINTS.verifyOtp, { identifier, otp })
    await mockResponse(null, { latency: 700 })
    if (!/^\d{6}$/.test(otp ?? '')) {
      throw authError('That code is not valid. Check the six digits and try again.', 'invalid_otp')
    }
    return { ok: true, resetToken: `reset.${Date.now()}` }
  },

  async resetPassword({ resetToken, password }) {
    if (!USE_MOCK) return apiClient.post(ENDPOINTS.resetPassword, { resetToken, password })
    await mockResponse(null, { latency: 800 })
    if (!password || password.length < 8) {
      throw authError('Passwords are at least 8 characters.', 'weak_password')
    }
    return { ok: true }
  },
}

export default authService
