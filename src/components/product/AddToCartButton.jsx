import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Button from '../common/Button'

/**
 * Add-to-bag control with the confirmation swap:
 *   ADD TO BAG  →  ADDED ✓  →  ADD TO BAG
 * The label change is the confirmation, so the interaction never depends on a
 * toast the visitor might miss.
 */
export function AddToCartButton({
  onAdd,
  disabled,
  label = 'Add to bag',
  confirmLabel = 'Added',
  size = 'lg',
  variant = 'primary',
  fullWidth = true,
  className,
}) {
  const [state, setState] = useState('idle') // idle | loading | done

  useEffect(() => {
    if (state !== 'done') return undefined
    const timer = setTimeout(() => setState('idle'), 1800)
    return () => clearTimeout(timer)
  }, [state])

  const handleClick = async () => {
    if (state !== 'idle' || disabled) return
    setState('loading')
    try {
      await onAdd()
      setState('done')
    } catch {
      setState('idle')
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      isLoading={state === 'loading'}
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      className={className}
      magnetic={false}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state === 'done' ? 'done' : 'idle'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          {state === 'done' ? (
            <>
              {confirmLabel}
              <Check className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            label
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}

export default AddToCartButton
