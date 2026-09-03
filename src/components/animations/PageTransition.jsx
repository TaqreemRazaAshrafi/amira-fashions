import { motion, useReducedMotion } from 'framer-motion'
import { pageTransition } from './variants'

/** Wraps each route so navigation fades rather than snaps. */
export function PageTransition({ children, className }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
