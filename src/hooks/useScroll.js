import { useEffect, useRef, useState } from 'react'

/**
 * Scroll observation for the navbar.
 * Reads are batched into rAF so the listener never lays out on every event.
 */
export function useScrollState({ threshold = 24, hideThreshold = 320 } = {}) {
  const [state, setState] = useState({ scrolled: false, hidden: false, y: 0 })
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      const goingDown = y > lastY.current
      setState({
        scrolled: y > threshold,
        // Only hide once the user is well past the hero and moving down.
        hidden: goingDown && y > hideThreshold,
        y,
      })
      lastY.current = y
      ticking.current = false
    }

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold, hideThreshold])

  return state
}
