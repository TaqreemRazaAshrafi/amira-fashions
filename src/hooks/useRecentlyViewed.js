import { useCallback, useEffect, useState } from 'react'
import { storage, STORAGE_KEYS } from '../utils/storage'

const MAX = 8

/** Tracks the last few products a visitor opened, persisted locally. */
export function useRecentlyViewed() {
  const [slugs, setSlugs] = useState(() => storage.get(STORAGE_KEYS.recentlyViewed, []))

  useEffect(() => {
    storage.set(STORAGE_KEYS.recentlyViewed, slugs)
  }, [slugs])

  const track = useCallback((slug) => {
    if (!slug) return
    setSlugs((previous) => [slug, ...previous.filter((s) => s !== slug)].slice(0, MAX))
  }, [])

  return { slugs, track, clear: () => setSlugs([]) }
}
