import { useEffect } from 'react'

/** Calls `handler` on a pointer press outside `ref`, or on Escape. */
export function useOnClickOutside(ref, handler, { escape = true } = {}) {
  useEffect(() => {
    if (!handler) return undefined

    const onPointer = (event) => {
      const el = ref.current
      if (!el || el.contains(event.target)) return
      handler(event)
    }
    const onKey = (event) => {
      if (escape && event.key === 'Escape') handler(event)
    }

    document.addEventListener('mousedown', onPointer)
    document.addEventListener('touchstart', onPointer, { passive: true })
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('touchstart', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, handler, escape])
}
