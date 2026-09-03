import { cn } from '../../utils/cn'
import { formatPrice, titleCase } from '../../utils/format'
import Image from '../common/Image'
import CartSummary from '../cart/CartSummary'

/**
 * Read-only recap of the bag shown alongside the checkout form.
 * Quantities cannot be edited here — changing the order mid-payment is a
 * reliable way to charge the wrong amount.
 */
export function OrderSummary({ items, totals, className }) {
  return (
    <div className={cn('border border-line bg-surface p-6 sm:p-8', className)}>
      <h2 className="text-fluid-xs uppercase tracking-luxe">Order summary</h2>

      <ul className="mt-6 flex flex-col divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <div className="relative w-14 shrink-0">
              <Image src={item.image} alt="" ratio="portrait" width={160} sizes="56px" />
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-text px-1 text-[10px] text-background">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-fluid-sm">{item.name}</p>
              <p className="mt-0.5 text-fluid-xs uppercase tracking-wide text-muted">
                {[item.size, item.color && titleCase(item.color)].filter(Boolean).join(' · ')}
              </p>
            </div>
            <p className="shrink-0 text-fluid-sm tabular-nums">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <CartSummary totals={totals} className="mt-6" />
    </div>
  )
}

export default OrderSummary
