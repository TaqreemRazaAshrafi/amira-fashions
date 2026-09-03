import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce } from './variants'

/** Parent for a group of `Reveal`-style children that should cascade in. */
export function Stagger({
  children,
  stagger = 0.08,
  delayChildren = 0,
  as = 'div',
  className,
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
      viewport={viewportOnce}
      variants={staggerContainer(stagger, delayChildren)}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/** Child of `Stagger`; inherits the parent's hidden/visible orchestration. */
export function StaggerItem({ children, variants = fadeUp, as = 'div', className, ...rest }) {
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
    <MotionTag className={className} variants={variants} {...rest}>
      {children}
    </MotionTag>
  )
}

export default Stagger
