import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Ruler, Share2, Truck } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { SITE } from '../../constants/site'
import { sizeGuide } from '../../data/support'
import { titleCase } from '../../utils/format'
import { useAsync } from '../../hooks/useAsync'
import { useProductSelection } from '../../hooks/useProductSelection'
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed'
import productService from '../../services/productService'
import { useUIStore } from '../../store/uiStore'
import Seo, { structuredData } from '../../components/common/Seo'
import Accordion from '../../components/common/Accordion'
import Badge from '../../components/common/Badge'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Rating from '../../components/common/Rating'
import { ProductDetailSkeleton } from '../../components/common/Skeleton'
import { ErrorState } from '../../components/common/States'
import SectionHeader from '../../components/layout/SectionHeader'
import ProductGallery from '../../components/product/ProductGallery'
import ProductRail from '../../components/product/ProductRail'
import PriceTag from '../../components/product/PriceTag'
import SizeSelector from '../../components/product/SizeSelector'
import QuantitySelector from '../../components/product/QuantitySelector'
import AddToCartButton from '../../components/product/AddToCartButton'
import WishlistButton from '../../components/product/WishlistButton'
import NotFoundPage from '../NotFound'

/** Body-measurement table, opened from beside the size selector. */
function SizeGuideModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Size guide" size="md">
      <div className="p-6 sm:p-9">
        <h3 className="text-fluid-xl">Size guide</h3>
        <p className="mt-3 max-w-prose text-fluid-sm leading-relaxed text-muted">
          {sizeGuide.note}
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-fluid-sm">
            <caption className="sr-only">Body measurements in {sizeGuide.unit}</caption>
            <thead>
              <tr className="border-b border-line text-left">
                {['Size', 'Bust', 'Waist', 'Hip'].map((heading) => (
                  <th key={heading} scope="col" className="py-3 pr-4 text-fluid-xs uppercase tracking-wide text-muted">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeGuide.rows.map((row) => (
                <tr key={row.size} className="border-b border-line/60">
                  <th scope="row" className="py-3 pr-4 text-left font-normal">
                    {row.size}
                  </th>
                  <td className="py-3 pr-4 tabular-nums text-muted">{row.bust}&Prime;</td>
                  <td className="py-3 pr-4 tabular-nums text-muted">{row.waist}&Prime;</td>
                  <td className="py-3 tabular-nums text-muted">{row.hip}&Prime;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  )
}

/**
 * Product detail.
 *
 * Gallery on the left, a single decision column on the right. Everything below
 * the fold (material, care, shipping, returns) is in a disclosure list so the
 * buying decision is never buried under specification copy.
 */
export default function ProductDetailsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const toast = useUIStore((state) => state.toast)
  const { track } = useRecentlyViewed()
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)

  const fetcher = useCallback(() => productService.getBySlug(slug), [slug])
  const { data: product, isLoading, isError, error, retry } = useAsync(fetcher, [slug])

  const relatedFetcher = useCallback(() => productService.getRelated(slug, 8), [slug])
  const { data: related } = useAsync(relatedFetcher, [slug])

  useEffect(() => {
    if (product) track(product.slug)
  }, [product, track])

  const selection = useProductSelection(product, { openCartOnAdd: true })

  if (isLoading) {
    return (
      <div className="shell section-y">
        <ProductDetailSkeleton />
      </div>
    )
  }

  if (isError && (error?.status === 404 || error?.code === 'not_found')) return <NotFoundPage />

  if (isError || !product) {
    return (
      <div className="shell section-y">
        <ErrorState
          title="We could not load this piece."
          description="The connection dropped on the way. Try again in a moment."
          onRetry={retry}
        />
      </div>
    )
  }

  const { size, color, quantity, error: selectionError, maxQuantity, setSize, setColor, setQuantity, addToCart } =
    selection

  const crumbs = [
    { label: 'Home', to: ROUTES.home },
    { label: 'Shop', to: ROUTES.shop },
    { label: titleCase(product.category), to: ROUTES.shopCategory(product.category) },
    { label: product.name, to: ROUTES.product(product.slug) },
  ]

  const buyNow = async () => {
    try {
      await addToCart()
      navigate(ROUTES.checkout)
    } catch {
      /* addToCart surfaces its own validation message */
    }
  }

  const share = async () => {
    const url = `${SITE.url}${ROUTES.product(product.slug)}`
    try {
      if (navigator.share) await navigator.share({ title: product.name, url })
      else {
        await navigator.clipboard.writeText(url)
        toast({ title: 'Link copied', description: product.name })
      }
    } catch {
      /* the visitor dismissed the share sheet — nothing to report */
    }
  }

  const details = [
    { id: 'description', title: 'Details', content: product.description },
    { id: 'material', title: 'Material', content: product.material },
    {
      id: 'care',
      title: 'Care instructions',
      content: (
        <ul className="flex flex-col gap-2">
          {product.care.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ),
    },
    { id: 'shipping', title: 'Shipping', content: product.shipping },
    { id: 'returns', title: 'Returns', content: product.returns },
  ]

  return (
    <>
      <Seo
        title={product.name}
        description={product.description}
        image={product.images[0]}
        type="product"
        canonicalPath={ROUTES.product(product.slug)}
        jsonLd={structuredData.product(product)}
      />

      <div className="shell pb-section pt-8">
        <Breadcrumbs items={crumbs} className="mb-8" />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} video={product.video} alt={product.name} />

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {product.onSale && <Badge tone="sale">Sale</Badge>}
              {product.newArrival && <Badge tone="outline">New arrival</Badge>}
              {product.bestseller && <Badge tone="outline">Best seller</Badge>}
              {!product.inStock && <Badge tone="muted">Sold out</Badge>}
            </div>

            <h1 className="mt-5 text-fluid-2xl">{product.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
              {product.reviewCount > 0 && (
                <Rating value={product.rating} count={product.reviewCount} />
              )}
            </div>

            <p className="mt-6 max-w-prose text-fluid-sm leading-relaxed text-muted">
              {product.description}
            </p>

            {product.colors.length > 1 && (
              <div className="mt-9">
                <p className="eyebrow mb-3">Colour — {titleCase(color ?? '')}</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setColor(option)}
                      aria-pressed={color === option}
                      className={`border px-4 py-2 text-fluid-xs uppercase tracking-wide transition-colors duration-250 ${
                        color === option
                          ? 'border-text bg-text text-background'
                          : 'border-line hover:border-text'
                      }`}
                    >
                      {titleCase(option)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-9">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <p className="eyebrow">Size {size ? `— ${size}` : ''}</p>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-fluid-xs uppercase tracking-wide text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
                >
                  <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                  Size guide
                </button>
              </div>
              <SizeSelector
                sizes={product.sizes}
                value={size}
                onChange={setSize}
                error={selectionError}
              />
            </div>

            {product.inStock && product.lowStock && (
              <p className="mt-5 text-fluid-xs uppercase tracking-wide text-danger">
                Only {product.stock} left
              </p>
            )}

            <div className="mt-9 flex flex-col gap-3">
              <div className="flex items-stretch gap-3">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  max={maxQuantity}
                  className="shrink-0"
                />
                <AddToCartButton
                  onAdd={addToCart}
                  disabled={!product.inStock}
                  label={product.inStock ? 'Add to bag' : 'Sold out'}
                />
              </div>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                magnetic={false}
                disabled={!product.inStock}
                onClick={buyNow}
              >
                Buy it now
              </Button>
            </div>

            <div className="mt-7 flex items-center justify-between gap-4 border-y border-line py-5">
              <WishlistButton
                product={product}
                showLabel
                size="lg"
                className="text-muted hover:text-text"
              />
              <button
                type="button"
                onClick={share}
                className="inline-flex items-center gap-2 text-fluid-xs uppercase tracking-luxe text-muted transition-colors hover:text-text"
              >
                <Share2 className="h-4 w-4" strokeWidth={1.4} aria-hidden="true" />
                Share
              </button>
            </div>

            <p className="mt-5 flex items-start gap-2.5 text-fluid-xs leading-relaxed text-muted">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.3} aria-hidden="true" />
              Free standard shipping above ₹2,999 · Dispatched in 2 business days · Easy 7-day
              returns
            </p>

            <Accordion items={details} defaultOpenId="material" className="mt-10" allowMultiple />
          </div>
        </div>
      </div>

      {related?.length > 0 && (
        <section className="border-t border-line">
          <div className="shell section-y">
            <SectionHeader
              eyebrow="You may also like"
              title="Complete the look"
              action={{ label: 'Shop all', to: ROUTES.shop }}
            />
            <ProductRail products={related} />
          </div>
        </section>
      )}

      {/* Clears the fixed mobile bar so it never covers the footer. */}
      <div aria-hidden="true" className="h-20 lg:hidden" />

      {/* Mobile sticky buy bar — the primary action stays in reach on a phone. */}
      <div className="glass fixed inset-x-0 bottom-0 z-[60] border-t border-line px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-fluid-xs text-muted">{product.name}</p>
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
          </div>
          <AddToCartButton
            onAdd={addToCart}
            disabled={!product.inStock}
            label={product.inStock ? 'Add to bag' : 'Sold out'}
            size="md"
            fullWidth={false}
            className="shrink-0"
          />
        </div>
      </div>

      <SizeGuideModal open={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </>
  )
}
