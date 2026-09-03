import { useEffect } from 'react'

/**
 * Freezes background scrolling while a drawer or modal is open.
 * The scrollbar width is compensated with padding so the page does not shift.
 */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined

    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [locked])
}
