import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, viewportOnce } from './variants'

/**
 * Scroll-triggered reveal.
 *
 * When the visitor prefers reduced motion the element renders immediately with
 * no transform, rather than animating faster — the point is to remove movement,
 * not to speed it up.
 */
export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  as = 'div',
  className,
  once = true,
  ...rest
}) {
  const shouldReduceMotion = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  if (shouldReduceMotion) {
    const Tag = as
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewportOnce, once }}
      variants={variants}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export default Reveal
