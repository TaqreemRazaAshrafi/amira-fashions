import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { formatPrice, titleCase } from '../../utils/format'
import { useCartStore } from '../../store/cartStore'
import Image from '../common/Image'
import QuantitySelector from '../product/QuantitySelector'

/**
 * One cart line. Used by both the drawer and the full cart page — `compact`
 * switches between the two densities rather than duplicating the markup.
 */
export function CartLineItem({ item, compact = false, onNavigate }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  const variantLabel = [item.size, item.color && titleCase(item.color)].filter(Boolean).join(' · ')

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex gap-4', compact ? 'py-5' : 'py-6 sm:gap-6')}
    >
      <Link
        to={ROUTES.product(item.slug)}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className={cn('shrink-0', compact ? 'w-20' : 'w-24 sm:w-28')}
      >
        <Image src={item.image} alt="" ratio="portrait" width={280} sizes="112px" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={cn('leading-snug', compact ? 'text-fluid-sm' : 'text-fluid-base')}>
              <Link
                to={ROUTES.product(item.slug)}
                onClick={onNavigate}
                className="transition-colors duration-250 hover:text-accent"
              >
                {item.name}
              </Link>
            </h3>
            {variantLabel && (
              <p className="mt-1 text-fluid-xs uppercase tracking-wide text-muted">
                {variantLabel}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from bag`}
            className="-mr-2 -mt-1 shrink-0 p-2 text-muted transition-colors duration-250 hover:text-danger"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <QuantitySelector
            value={item.quantity}
            onChange={(next) => updateQuantity(item.id, next)}
            max={item.maxQuantity}
            size="sm"
          />

          <p className="flex items-baseline gap-2 text-fluid-sm">
            <span>{formatPrice(item.price * item.quantity)}</span>
            {item.compareAtPrice && item.compareAtPrice > item.price && (
              <span className="text-fluid-xs text-muted line-through">
                {formatPrice(item.compareAtPrice * item.quantity)}
              </span>
            )}
          </p>
        </div>
      </div>
    </motion.li>
  )
}

export default CartLineItem
