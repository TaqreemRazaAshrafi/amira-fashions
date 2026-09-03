import { useEffect } from 'react'

/**
 * Closes an overlay on Escape.
 *
 * Required by the ARIA dialog pattern: a modal that can only be dismissed by
 * clicking a target is unusable from the keyboard. Listening on the document
 * (rather than the panel) means it works even when focus has drifted.
 */
export function useEscapeKey(active, handler) {
  useEffect(() => {
    if (!active || !handler) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        handler(event)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active, handler])
}

export default useEscapeKey
