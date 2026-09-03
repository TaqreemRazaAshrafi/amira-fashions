import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Restores the scroll position on navigation.
 *
 * Only pathname changes reset scroll — query-string changes (filters, sort)
 * deliberately keep the visitor where they are.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname, hash])

  return null
}

export default ScrollToTop
