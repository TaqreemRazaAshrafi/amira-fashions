import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { titleCase } from '../../utils/format'
import { useProductSelection } from '../../hooks/useProductSelection'
import { useUIStore } from '../../store/uiStore'
import Modal from '../common/Modal'
import Image from '../common/Image'
import Rating from '../common/Rating'
import PriceTag from './PriceTag'
import SizeSelector from './SizeSelector'
import QuantitySelector from './QuantitySelector'
import AddToCartButton from './AddToCartButton'
import WishlistButton from './WishlistButton'

/**
 * Quick view.
 *
 * Deliberately a subset of the product page — one image, variants, add to bag —
 * with a link through to the full detail page for everything else. Shares
 * `useProductSelection` with the PDP so the two can never disagree about what
 * "selected" means.
 */
function QuickViewContent({ product, onClose }) {
  const { size, color, quantity, error, maxQuantity, setSize, setColor, setQuantity, addToCart } =
    useProductSelection(product, { openCartOnAdd: false })

  return (
    <div className="grid gap-0 sm:grid-cols-2">
      <Image
        src={product.images[0]}
        alt={product.name}
        ratio="portrait"
        width={900}
        sizes="(max-width: 640px) 100vw, 45vw"
        priority
        className="h-full"
      />

      <div className="flex flex-col gap-5 p-6 sm:p-9">
        <div>
          <p className="eyebrow mb-3">{titleCase(product.category)}</p>
          <h3 className="text-fluid-xl">{product.name}</h3>
          <PriceTag
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="lg"
            className="mt-3"
          />
          {product.reviewCount > 0 && (
            <Rating value={product.rating} count={product.reviewCount} className="mt-3" />
          )}
        </div>

        <p className="line-clamp-2-safe text-fluid-sm leading-relaxed text-muted">
          {product.description}
        </p>

        <div>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <p className="eyebrow">Size</p>
            {size && <p className="text-fluid-xs text-muted">Selected: {size}</p>}
          </div>
          <SizeSelector sizes={product.sizes} value={size} onChange={setSize} error={error} />
        </div>

        {product.colors.length > 1 && (
          <div>
            <p className="eyebrow mb-3">Colour</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setColor(option)}
                  aria-pressed={color === option}
                  className={`border px-3 py-1.5 text-fluid-xs uppercase tracking-wide transition-colors duration-250 ${
                    color === option ? 'border-text bg-text text-background' : 'border-line hover:border-text'
                  }`}
                >
                  {titleCase(option)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <QuantitySelector value={quantity} onChange={setQuantity} max={maxQuantity} />
          <AddToCartButton
            onAdd={addToCart}
            disabled={!product.inStock}
            label={product.inStock ? 'Add to bag' : 'Sold out'}
            size="md"
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line pt-5">
          <WishlistButton product={product} showLabel className="text-muted hover:text-text" />
          <Link
            to={ROUTES.product(product.slug)}
            onClick={onClose}
            className="group inline-flex items-center gap-2 text-fluid-xs uppercase tracking-luxe transition-colors duration-250 hover:text-accent"
          >
            Full details
            <ArrowRight
              className="h-4 w-4 transition-transform duration-400 ease-luxe group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}

export function QuickViewModal() {
  const product = useUIStore((state) => state.quickViewProduct)
  const close = useUIStore((state) => state.closeQuickView)

  return (
    <Modal open={Boolean(product)} onClose={close} title={product?.name ?? 'Quick view'} size="lg">
      {/* Keyed so the selection state resets when a different product opens. */}
      {product && <QuickViewContent key={product.id} product={product} onClose={close} />}
    </Modal>
  )
}

export default QuickViewModal
