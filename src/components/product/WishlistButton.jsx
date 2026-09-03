import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useWishlistStore } from '../../store/wishlistStore'
import { useUIStore } from '../../store/uiStore'

/**
 * Heart toggle with the outline → filled transition.
 * The state is announced via aria-pressed, so it is not communicated by the
 * fill colour alone.
 */
export function WishlistButton({ product, className, size = 'md', showLabel = false }) {
  const isSaved = useWishlistStore((state) => state.items.some((i) => i.productId === product.id))
  const toggle = useWishlistStore((state) => state.toggle)
  const toast = useUIStore((state) => state.toast)

  const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'

  const onClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const nowSaved = toggle(product)
    toast({
      title: nowSaved ? 'Saved to wishlist' : 'Removed from wishlist',
      description: product.name,
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn(
        'group/heart inline-flex items-center gap-2 transition-colors duration-250',
        className
      )}
    >
      <span className="relative inline-flex">
        <Heart
          className={cn(iconSize, 'transition-colors duration-250', isSaved ? 'text-danger' : 'text-current')}
          strokeWidth={1.4}
          aria-hidden="true"
        />
        <AnimatePresence>
          {isSaved && (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 16 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Heart className={cn(iconSize, 'fill-danger text-danger')} strokeWidth={1.4} aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {showLabel && (
        <span className="text-fluid-xs uppercase tracking-luxe">
          {isSaved ? 'Saved' : 'Add to wishlist'}
        </span>
      )}
    </button>
  )
}

export default WishlistButton
