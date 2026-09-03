import axios from 'axios'
import { storage, STORAGE_KEYS } from '../utils/storage'

/**
 * The single Axios instance for the app.
 *
 * Nothing outside `services/` should import this — components talk to services,
 * services talk to the client. That keeps request shape, auth and error
 * normalisation in one place.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

/** Attaches the bearer token, if the user is signed in. */
apiClient.interceptors.request.use((config) => {
  const session = storage.get(STORAGE_KEYS.auth)
  if (session?.token) config.headers.Authorization = `Bearer ${session.token}`
  return config
})

/** Error shape every service (and therefore every component) can rely on. */
export class ApiError extends Error {
  constructor({ message, status, code, details }) {
    super(message)
    this.name = 'ApiError'
    this.status = status ?? 0
    this.code = code ?? 'unknown_error'
    this.details = details ?? null
  }
}

function normalizeError(error) {
  if (axios.isCancel?.(error) || error.code === 'ERR_CANCELED') {
    return new ApiError({ message: 'Request cancelled', code: 'cancelled' })
  }
  if (error.response) {
    const { status, data } = error.response
    return new ApiError({
      message: data?.message || defaultMessageFor(status),
      status,
      code: data?.code || `http_${status}`,
      details: data?.errors ?? null,
    })
  }
  if (error.request) {
    return new ApiError({
      message: 'We could not reach the server. Check your connection and try again.',
      code: 'network_error',
    })
  }
  return new ApiError({ message: error.message, code: 'client_error' })
}

function defaultMessageFor(status) {
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return 'You do not have permission to do that.'
  if (status === 404) return 'We could not find what you were looking for.'
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  if (status >= 500) return 'Something went wrong on our side. Please try again shortly.'
  return 'Something went wrong. Please try again.'
}

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const apiError = normalizeError(error)
    // An expired session is cleared here so the UI never loops on a dead token.
    if (apiError.status === 401) storage.remove(STORAGE_KEYS.auth)
    return Promise.reject(apiError)
  }
)

export default apiClient
