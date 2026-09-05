import { cn } from '../../utils/cn'
import { formatPrice, pluralize } from '../../utils/format'

/**
 * Money breakdown shared by the cart drawer, the cart page and checkout.
 * Totals are always passed in — this component never computes them.
 */
export function CartSummary({ totals, className, showItemCount = false }) {
  const rows = [
    showItemCount && {
      label: `Subtotal · ${pluralize(totals.itemCount, 'item')}`,
      value: formatPrice(totals.subtotal),
    },
    !showItemCount && { label: 'Subtotal', value: formatPrice(totals.subtotal) },
    totals.savings > 0 && {
      label: 'You save',
      value: `− ${formatPrice(totals.savings)}`,
      tone: 'accent',
    },
    totals.discount > 0 && {
      label: totals.couponCode ? `Discount · ${totals.couponCode}` : 'Discount',
      value: `− ${formatPrice(totals.discount)}`,
      tone: 'accent',
    },
    {
      label: 'Shipping',
      value: totals.shipping === 0 ? 'Complimentary' : formatPrice(totals.shipping),
    },
    totals.tax > 0 && { label: 'Tax', value: formatPrice(totals.tax) },
  ].filter(Boolean)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-4 text-fluid-sm">
          <span className="text-muted">{row.label}</span>
          <span className={cn('tabular-nums', row.tone === 'accent' && 'text-accent')}>
            {row.value}
          </span>
        </div>
      ))}

      <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <span className="text-fluid-xs uppercase tracking-luxe">Total</span>
        <span className="font-display text-fluid-xl tabular-nums">
          {formatPrice(totals.total)}
        </span>
      </div>

      <p className="text-fluid-xs text-muted">Inclusive of all taxes.</p>
    </div>
  )
}

export default CartSummary
