import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { formatPrice } from '../../utils/format'
import productService from '../../services/productService'
import { useWishlistStore } from '../../store/wishlistStore'
import { useUIStore } from '../../store/uiStore'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import Image from '../../components/common/Image'
import { EmptyState } from '../../components/common/States'
import PageHero from '../../components/layout/PageHero'

/**
 * Saved pieces.
 *
 * "Move to bag" opens quick view rather than adding blind — a wishlist entry
 * has no size on it, and guessing one is how the wrong parcel gets shipped.
 */
export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items)
  const remove = useWishlistStore((state) => state.remove)
  const clear = useWishlistStore((state) => state.clear)
  const openQuickView = useUIStore((state) => state.openQuickView)
  const toast = useUIStore((state) => state.toast)
  const [loadingSlug, setLoadingSlug] = useState(null)

  const moveToBag = async (item) => {
    setLoadingSlug(item.slug)
    try {
      const product = await productService.getBySlug(item.slug)
      openQuickView(product)
    } catch {
      toast({
        title: 'Could not open that piece',
        description: 'Please try again in a moment.',
        variant: 'error',
      })
    } finally {
      setLoadingSlug(null)
    }
  }

  return (
    <>
      <Seo
        title="Wishlist"
        description="The Amira Fashions pieces you have saved."
        canonicalPath={ROUTES.wishlist}
        noIndex
      />

      <PageHero
        eyebrow="Saved for later"
        title="Wishlist"
        description={
          items.length > 0
            ? 'Saved pieces stay here on this device. Sizes sell out quickly — the atelier line is not restocked.'
            : undefined
        }
        breadcrumbs={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Wishlist', to: ROUTES.wishlist },
        ]}
      />

      <div className="shell pb-section">
        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            description="Tap the heart on any piece to keep it here while you decide."
            action={
              <Button to={ROUTES.shop} variant="outline">
                Browse the shop
              </Button>
            }
          />
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between border-b border-line pb-4">
              <p className="text-fluid-xs uppercase tracking-luxe">
                {items.length} saved piece{items.length === 1 ? '' : 's'}
              </p>
              <button
                type="button"
                onClick={clear}
                className="text-fluid-xs text-muted underline-offset-4 transition-colors hover:text-danger hover:underline"
              >
                Clear wishlist
              </button>
            </div>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex flex-col"
                  >
                    <div className="relative overflow-hidden bg-surface-alt">
                      <Link to={ROUTES.product(item.slug)} data-cursor="View">
                        <Image
                          src={item.image}
                          alt={item.name}
                          ratio="portrait"
                          width={700}
                          sizes="(max-width: 640px) 50vw, 25vw"
                          imgClassName="transition-transform duration-800 ease-luxe group-hover:scale-105"
                        />
                      </Link>

                      <button
                        type="button"
                        onClick={() => remove(item.productId)}
                        aria-label={`Remove ${item.name} from wishlist`}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-background/85 text-text backdrop-blur-sm transition-colors duration-250 hover:bg-background hover:text-danger"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <h2 className="mt-4 text-fluid-sm leading-snug">
                      <Link
                        to={ROUTES.product(item.slug)}
                        className="link-underline transition-colors hover:text-accent"
                      >
                        {item.name}
                      </Link>
                    </h2>
                    <p className="mt-1.5 text-fluid-xs text-muted">{formatPrice(item.price)}</p>

                    <Button
                      variant="quiet"
                      size="sm"
                      fullWidth
                      magnetic={false}
                      className="mt-4"
                      isLoading={loadingSlug === item.slug}
                      onClick={() => moveToBag(item)}
                    >
                      Move to bag
                    </Button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </>
        )}
      </div>
    </>
  )
}
