import { cn } from '../../utils/cn'
import { formatDiscount, formatPrice } from '../../utils/format'

/** Price with strike-through compare-at and an optional saving percentage. */
export function PriceTag({ price, compareAtPrice, size = 'md', showDiscount = true, className }) {
  const discount = formatDiscount(price, compareAtPrice)
  const sizes = {
    sm: 'text-fluid-xs',
    md: 'text-fluid-sm',
    lg: 'text-fluid-lg',
  }

  return (
    <p className={cn('flex flex-wrap items-baseline gap-2', sizes[size] ?? sizes.md, className)}>
      <span className="text-text">{formatPrice(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <>
          <span className="text-muted line-through">{formatPrice(compareAtPrice)}</span>
          {showDiscount && discount && (
            <span className="text-[11px] uppercase tracking-wide text-danger">{discount}% off</span>
          )}
        </>
      )}
    </p>
  )
}

export default PriceTag
