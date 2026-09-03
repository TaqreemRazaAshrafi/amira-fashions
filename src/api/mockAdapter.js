/**
 * Mock transport used while `VITE_USE_MOCK_API` is true.
 *
 * It resolves against the local dataset behind an artificial delay so loading
 * and error states are exercised in development exactly as they will be in
 * production. Flip the env flag (or delete this file and the guards in
 * `services/`) once a real backend exists.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'

const DEFAULT_LATENCY = 320

export function mockResponse(data, { latency = DEFAULT_LATENCY, failureRate = 0 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failureRate > 0 && Math.random() < failureRate) {
        reject(new Error('Simulated network failure'))
        return
      }
      // Structured-clone keeps callers from mutating the mock dataset.
      resolve(typeof structuredClone === 'function' ? structuredClone(data) : data)
    }, latency)
  })
}
