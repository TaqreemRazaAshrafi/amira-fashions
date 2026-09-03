import { useEffect, useState } from 'react'
import { BREAKPOINTS } from '../constants/site'

/** Subscribes to a media query and returns its current match state. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  )

  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = (event) => setMatches(event.matches)
    setMatches(list.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useIsDesktop = () => useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`)
export const useIsMobile = () => useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`)

/** True when the visitor has asked the OS to reduce motion. */
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')

/** Distinguishes touch devices, used to disable the custom cursor. */
export const useHasFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
