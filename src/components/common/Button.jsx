import { forwardRef, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

/** Router Link with motion props, created once at module scope. */
const MotionLink = motion.create(Link)

/**
 * Variants are mutually exclusive: `cn` is a plain joiner, so passing a
 * conflicting colour through `className` leaves two utilities of equal
 * specificity fighting, and which one wins depends on Tailwind's output order
 * rather than on intent. Anything needing a different colour treatment belongs
 * here as its own variant.
 *
 * `outlineLight` is the outline button as it must look over a photograph: a
 * translucent backdrop carries it over both the bright and dark parts of an
 * image, where a plain border alone disappears.
 */
const VARIANTS = {
  primary: 'bg-text text-background hover:bg-secondary',
  outline: 'border border-text/25 text-text hover:border-text hover:bg-text hover:text-background',
  outlineLight:
    'border border-background/60 bg-text/25 text-background backdrop-blur-sm hover:border-background hover:bg-background hover:text-text',
  ghost: 'text-text hover:bg-text/5',
  accent: 'bg-accent text-background hover:bg-accent/90',
  light: 'bg-background text-text hover:bg-surface-alt',
  quiet: 'border border-line bg-surface text-text hover:border-text/40',
}

const SIZES = {
  sm: 'h-9 px-4 text-[11px]',
  md: 'h-11 px-6 text-fluid-xs',
  lg: 'h-14 px-9 text-fluid-xs',
}

/**
 * The single button in the system.
 *
 * Renders as <button>, <a> or react-router <Link> depending on the props given,
 * so a "link that looks like a button" never means a div with an onClick.
 * On desktop it leans very slightly toward the cursor; the effect is disabled
 * under reduced-motion and on touch devices (where there is no hover anyway).
 */
export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    to,
    href,
    type = 'button',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    magnetic = true,
    className,
    icon: Icon,
    iconPosition = 'right',
    ...rest
  },
  forwardedRef
) {
  const localRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const isInteractive = !disabled && !isLoading
  const useMagnet = magnetic && !shouldReduceMotion

  const handleMouseMove = (event) => {
    if (!useMagnet || !localRef.current) return
    const rect = localRef.current.getBoundingClientRect()
    const relX = event.clientX - (rect.left + rect.width / 2)
    const relY = event.clientY - (rect.top + rect.height / 2)
    // Cap the pull so the control never separates from its layout slot.
    setOffset({ x: Math.max(-8, Math.min(8, relX * 0.22)), y: Math.max(-6, Math.min(6, relY * 0.3)) })
  }

  const classes = cn(
    'group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden',
    'font-sans uppercase tracking-luxe transition-colors duration-400 ease-luxe',
    'disabled:cursor-not-allowed disabled:opacity-45',
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth && 'w-full',
    className
  )

  const content = (
    <>
      {isLoading ? (
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      ) : (
        Icon && iconPosition === 'left' && <Icon aria-hidden="true" className="h-4 w-4" />
      )}
      <span className="translate-y-px">{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-400 ease-luxe group-hover:translate-x-1"
        />
      )}
    </>
  )

  const motionProps = {
    ref: (node) => {
      localRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    className: classes,
    onMouseMove: handleMouseMove,
    onMouseLeave: () => setOffset({ x: 0, y: 0 }),
    animate: useMagnet ? offset : undefined,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  }

  if (to && isInteractive) {
    return (
      <MotionLink {...motionProps} to={to} {...rest}>
        {content}
      </MotionLink>
    )
  }

  if (href && isInteractive) {
    return (
      <motion.a {...motionProps} href={href} target="_blank" rel="noreferrer noopener" {...rest}>
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      {...motionProps}
      type={type}
      disabled={!isInteractive}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {content}
    </motion.button>
  )
})

export default Button
