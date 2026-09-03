import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { useUIStore } from '../../store/uiStore'
import Image from '../common/Image'
import Badge from '../common/Badge'
import PriceTag from './PriceTag'
import WishlistButton from './WishlistButton'

/**
 * Editorial product card.
 *
 * The whole card is one link; the wishlist and quick-view controls sit above it
 * and stop propagation, so there are no nested interactive elements. On hover
 * the second photograph cross-fades in and the primary scales very slightly —
 * 1 → 1.04, which reads as life rather than movement.
 *
 * Memoised because grids re-render on every filter keystroke.
 */
function ProductCardComponent({ product, priority = false, className, sizes }) {
  const openQuickView = useUIStore((state) => state.openQuickView)
  const [primaryImage, secondaryImage] = product.images
  const href = ROUTES.product(product.slug)

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative overflow-hidden bg-surface-alt">
        <Link
          to={href}
          className="block focus-visible:outline-none"
          data-cursor="View"
          aria-label={product.name}
        >
          <div className="relative aspect-[3/4]">
            <motion.div
              className="absolute inset-0"
              initial={false}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={primaryImage}
                alt={product.name}
                ratio="auto"
                width={800}
                sizes={sizes ?? '(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw'}
                priority={priority}
                className="h-full w-full"
              />
            </motion.div>

            {/* Second angle — only rendered on devices that can hover. */}
            {secondaryImage && (
              <div className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-600 ease-luxe group-hover:opacity-100 lg:block">
                <Image
                  src={secondaryImage}
                  alt=""
                  ratio="auto"
                  width={800}
                  sizes="25vw"
                  className="h-full w-full"
                />
              </div>
            )}
          </div>
        </Link>

        {/* Status flags */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.onSale && <Badge tone="sale">Sale</Badge>}
          {product.newArrival && !product.onSale && <Badge tone="light">New</Badge>}
          {!product.inStock && <Badge tone="muted">Sold out</Badge>}
          {product.inStock && product.lowStock && <Badge tone="light">Low stock</Badge>}
        </div>

        <WishlistButton
          product={product}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-background/85 text-text backdrop-blur-sm transition-colors duration-250 hover:bg-background"
        />

        {/* Quick view: revealed on hover for pointer devices, always available
            to keyboard users via focus-within. */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-400 ease-luxe group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="flex w-full items-center justify-center gap-2 bg-background/95 py-2.5 text-[10px] uppercase tracking-luxe text-text backdrop-blur transition-colors duration-250 hover:bg-text hover:text-background"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            Quick view
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-4">
        <h3 className="text-fluid-sm leading-snug">
          <Link to={href} className="link-underline transition-colors duration-250 hover:text-accent">
            {product.name}
          </Link>
        </h3>

        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />

        <p className="mt-1 text-fluid-xs uppercase tracking-wide text-muted">
          <span className="sr-only">Available sizes: </span>
          {product.sizes.join(' · ')}
        </p>
      </div>
    </article>
  )
}

export const ProductCard = memo(ProductCardComponent)
export default ProductCard
