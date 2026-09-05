import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, Heart, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { formatPrice } from '../../utils/format'
import { useAsync } from '../../hooks/useAsync'
import productService from '../../services/productService'
import { useWishlistStore } from '../../store/wishlistStore'
import { useUIStore } from '../../store/uiStore'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import Image from '../../components/common/Image'
import { EmptyState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeleton'
import PageHero from '../../components/layout/PageHero'

/**
 * Saved pieces.
 *
 * The store keeps a snapshot taken at save time; this page re-fetches the live
 * product for each entry so availability and price are current. That difference
 * is the point of a wishlist — "back in stock" and "now ₹800 less" are why
 * people come back to one — so a stale snapshot is surfaced as a price change
 * rather than quietly shown as the truth.
 *
 * "Move to bag" opens quick view rather than adding blind: a wishlist entry has
 * no size on it, and guessing one is how the wrong parcel gets shipped.
 */
export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items)
  const remove = useWishlistStore((state) => state.remove)
  const clear = useWishlistStore((state) => state.clear)
  const openQuickView = useUIStore((state) => state.openQuickView)
  const toast = useUIStore((state) => state.toast)
  const [loadingSlug, setLoadingSlug] = useState(null)

  const slugKey = items.map((item) => item.slug).join(',')

  // One settled batch: a delisted piece must not blank the whole page.
  const fetcher = useCallback(async () => {
    if (items.length === 0) return {}
    const results = await Promise.allSettled(
      items.map((item) => productService.getBySlug(item.slug))
    )
    return Object.fromEntries(
      results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => [result.value.slug, result.value])
    )
  }, [slugKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const { data: live, isLoading } = useAsync(fetcher, [slugKey])
  const liveBySlug = useMemo(() => live ?? {}, [live])

  const moveToBag = async (item) => {
    setLoadingSlug(item.slug)
    try {
      const product = liveBySlug[item.slug] ?? (await productService.getBySlug(item.slug))
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
            ? 'Prices and availability below are live. Sizes sell out quickly — the atelier line is not restocked.'
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
            title="Save the pieces you love."
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

            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const product = liveBySlug[item.slug]
                  const price = product?.price ?? item.price
                  // Only a *drop* since saving is worth interrupting for.
                  const priceDrop = product && item.price > product.price ? item.price - product.price : 0
                  const isSoldOut = product ? !product.inStock : false
                  const isLowStock = product?.lowStock ?? false

                  return (
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
                            imgClassName={cn(
                              'transition-transform duration-800 ease-luxe group-hover:scale-105',
                              isSoldOut && 'opacity-60'
                            )}
                          />
                        </Link>

                        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
                          {isSoldOut && (
                            <span className="bg-text/85 px-2.5 py-1 text-[10px] uppercase tracking-luxe text-background backdrop-blur-sm">
                              Sold out
                            </span>
                          )}
                          {!isSoldOut && isLowStock && (
                            <span className="bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-luxe text-text backdrop-blur-sm">
                              Low stock
                            </span>
                          )}
                          {priceDrop > 0 && (
                            <span className="flex items-center gap-1 bg-success/90 px-2.5 py-1 text-[10px] uppercase tracking-luxe text-background backdrop-blur-sm">
                              <ArrowDown className="h-3 w-3" aria-hidden="true" />
                              Price drop
                            </span>
                          )}
                        </div>

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

                      {isLoading && !product ? (
                        <Skeleton className="mt-2 h-3 w-20" />
                      ) : (
                        <p className="mt-1.5 flex flex-wrap items-baseline gap-2 text-fluid-xs">
                          <span className={priceDrop > 0 ? 'text-success' : 'text-muted'}>
                            {formatPrice(price)}
                          </span>
                          {priceDrop > 0 && (
                            <span className="text-muted line-through">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </p>
                      )}

                      {priceDrop > 0 && (
                        <p className="mt-1 text-fluid-xs text-success">
                          {formatPrice(priceDrop)} less than when you saved it.
                        </p>
                      )}

                      <Button
                        variant="quiet"
                        size="sm"
                        fullWidth
                        magnetic={false}
                        className="mt-4"
                        disabled={isSoldOut}
                        isLoading={loadingSlug === item.slug}
                        onClick={() => moveToBag(item)}
                      >
                        {isSoldOut ? 'Sold out' : 'Move to bag'}
                      </Button>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ul>
          </>
        )}
      </div>
    </>
  )
}
