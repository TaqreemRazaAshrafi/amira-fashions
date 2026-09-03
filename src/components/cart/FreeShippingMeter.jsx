import { motion } from 'framer-motion'
import { Truck } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/format'

/**
 * Progress toward the free-shipping threshold.
 * The bar is decorative; the sentence above it carries the information.
 */
export function FreeShippingMeter({ totals, className }) {
  const { subtotal, freeShippingThreshold, amountToFreeShipping } = totals
  const progress = Math.min(1, subtotal / freeShippingThreshold)
  const unlocked = amountToFreeShipping <= 0

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="flex items-center gap-2 text-fluid-xs text-muted">
        <Truck className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.4} aria-hidden="true" />
        {unlocked ? (
          <span className="text-text">Complimentary shipping unlocked.</span>
        ) : (
          <span>
            <span className="text-text">{formatPrice(amountToFreeShipping)}</span> away from free
            shipping.
          </span>
        )}
      </p>

      <div className="h-px w-full bg-line" aria-hidden="true">
        <motion.div
          className="h-px bg-accent"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

export default FreeShippingMeter
