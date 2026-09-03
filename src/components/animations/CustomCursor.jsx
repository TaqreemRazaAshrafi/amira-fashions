import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useHasFinePointer, usePrefersReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Desktop cursor companion.
 *
 * A small dot follows the pointer; over anything carrying `data-cursor="…"` it
 * expands into a labelled disc. Mounted only for fine pointers, so touch and
 * pen devices never pay for it, and skipped under reduced-motion.
 *
 * Usage: <div data-cursor="Quick View"> … </div>
 */
export function CustomCursor() {
  const hasFinePointer = useHasFinePointer()
  const prefersReducedMotion = usePrefersReducedMotion()
  const enabled = hasFinePointer && !prefersReducedMotion

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 520, damping: 42, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 520, damping: 42, mass: 0.5 })

  const [label, setLabel] = useState(null)
  const [isPressed, setIsPressed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined

    const onMove = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
      if (!isVisible) setIsVisible(true)

      const target = event.target instanceof Element ? event.target.closest('[data-cursor]') : null
      const next = target?.getAttribute('data-cursor') ?? null
      setLabel((current) => (current === next ? current : next))
    }

    const onLeave = () => setIsVisible(false)
    const onDown = () => setIsPressed(true)
    const onUp = () => setIsPressed(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [enabled, isVisible, x, y])

  if (!enabled) return null

  const expanded = Boolean(label)

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden lg:block"
      style={{ x: springX, y: springY }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-text/25 bg-background/60 backdrop-blur-sm"
        animate={{
          width: expanded ? 88 : 10,
          height: expanded ? 88 : 10,
          scale: isPressed ? 0.86 : 1,
          backgroundColor: expanded ? 'rgba(26,24,22,0.86)' : 'rgba(26,24,22,0.9)',
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      >
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.16 }}
              className="select-none px-2 text-center text-[10px] uppercase tracking-luxe text-background"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default CustomCursor
