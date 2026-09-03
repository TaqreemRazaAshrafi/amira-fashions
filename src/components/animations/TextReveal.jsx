import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { staggerContainer, viewportOnce, wordReveal } from './variants'

/**
 * Editorial headline reveal — each word rises out of its own overflow-hidden
 * mask. Splitting on words rather than characters keeps the text selectable
 * and readable to screen readers as a single string.
 */
export function TextReveal({ text, as = 'h2', className, stagger = 0.06, delay = 0, ...rest }) {
  const shouldReduceMotion = useReducedMotion()
  const Tag = as
  const MotionTag = motion[as] || motion.h2
  const words = String(text).split(' ')

  if (shouldReduceMotion) {
    return (
      <Tag className={className} {...rest}>
        {text}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={cn('inline-block', className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(stagger, delay)}
      aria-label={text}
      {...rest}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span variants={wordReveal} className="inline-block">
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

export default TextReveal
