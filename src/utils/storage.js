/**
 * localStorage wrapper that never throws.
 * Storage can be unavailable (private mode, blocked cookies, SSR), so every
 * access is guarded and failures degrade to in-memory-only behaviour.
 */
const memoryFallback = new Map()

function available() {
  try {
    const probe = '__amira_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

const hasStorage = typeof window !== 'undefined' && available()

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = hasStorage ? window.localStorage.getItem(key) : memoryFallback.get(key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      const raw = JSON.stringify(value)
      if (hasStorage) window.localStorage.setItem(key, raw)
      else memoryFallback.set(key, raw)
    } catch {
      /* quota exceeded or serialisation failure — non-fatal */
    }
  },
  remove(key) {
    try {
      if (hasStorage) window.localStorage.removeItem(key)
      else memoryFallback.delete(key)
    } catch {
      /* no-op */
    }
  },
}

export const STORAGE_KEYS = {
  cart: 'amira.cart.v1',
  wishlist: 'amira.wishlist.v1',
  auth: 'amira.auth.v1',
  user: 'amira.user.v1',
  orders: 'amira.orders.v1',
  recentSearches: 'amira.search.recent.v1',
  recentlyViewed: 'amira.recently-viewed.v1',
}
