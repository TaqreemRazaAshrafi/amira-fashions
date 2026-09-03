import { useEffect } from 'react'

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

/**
 * Keeps keyboard focus inside an open dialog and restores it on close —
 * required for any element with role="dialog" to be usable without a mouse.
 */
export function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active || !ref.current) return undefined

    const container = ref.current
    const previouslyFocused = document.activeElement

    const focusFirst = () => {
      const target =
        container.querySelector('[data-autofocus]') || container.querySelectorAll(FOCUSABLE)[0]
      target?.focus({ preventScroll: true })
    }
    // Wait for the entry animation to mount children before focusing.
    const raf = requestAnimationFrame(focusFirst)

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const nodes = Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null
      )
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused instanceof HTMLElement)
        previouslyFocused.focus({ preventScroll: true })
    }
  }, [ref, active])
}
