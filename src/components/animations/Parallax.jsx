import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * Scroll-linked vertical parallax. Disabled entirely under reduced motion and
 * intended for desktop — pass `enabled={false}` on touch layouts where the
 * effect costs more than it adds.
 */
export function Parallax({ children, speed = 0.12, className, enabled = true }) {
  const ref = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const distance = `${speed * 100}%`
  const y = useTransform(scrollYProgress, [0, 1], [`-${distance}`, distance])

  if (shouldReduceMotion || !enabled) return <div className={className}>{children}</div>

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}

export default Parallax
