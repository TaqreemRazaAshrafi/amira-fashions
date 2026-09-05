import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { formatDate, formatPrice, pluralize } from '../../utils/format'
import { ORDER_STATUS_LABELS, trackingFor } from '../../services/orderService'
import Image from '../common/Image'
import Button from '../common/Button'

/** Status pill tone. Delivered reads settled, cancelled reads inert. */
const STATUS_TONES = {
  delivered: 'border-success/40 bg-success/10 text-success',
  cancelled: 'border-line bg-surface-alt text-muted',
  default: 'border-accent/40 bg-accent/10 text-accent',
}

/**
 * One order in the history list.
 *
 * The status shown is derived from the order's own age via `trackingFor`, so the
 * pill here and the timeline on the detail page can never disagree.
 */
export function OrderCard({ order, className }) {
  const { currentStatus } = trackingFor(order)
  const tone = STATUS_TONES[currentStatus] ?? STATUS_TONES.default
  const items = order.items ?? []
  const preview = items.slice(0, 4)
  const remaining = items.length - preview.length

  return (
    <article className={cn('border border-line bg-surface', className)}>
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-5 sm:p-6">
        <div>
          <p className="text-fluid-xs uppercase tracking-luxe text-muted">Order</p>
          <p className="mt-1 font-display text-fluid-lg">{order.id}</p>
          <p className="mt-1 text-fluid-xs text-muted">
            Placed {formatDate(order.placedAt)} · {pluralize(items.length, 'item')}
          </p>
        </div>

        <div className="text-right">
          <span
            className={cn(
              'inline-block border px-3 py-1 text-[10px] uppercase tracking-luxe',
              tone
            )}
          >
            {ORDER_STATUS_LABELS[currentStatus] ?? currentStatus}
          </span>
          <p className="mt-2 text-fluid-lg">{formatPrice(order.totals?.total ?? 0)}</p>
          <p className="text-fluid-xs text-muted">
            {order.payment?.method === 'cod' ? 'Cash on delivery' : 'Paid online'}
          </p>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-4 p-5 sm:p-6">
        <ul className="flex items-center gap-2">
          {preview.map((item) => (
            <li key={item.id} className="h-16 w-12 shrink-0 overflow-hidden bg-surface-alt">
              <Image
                src={item.image}
                alt={item.name}
                ratio="auto"
                width={120}
                sizes="48px"
                className="h-full w-full"
              />
            </li>
          ))}
          {remaining > 0 && (
            <li className="flex h-16 w-12 shrink-0 items-center justify-center bg-surface-alt text-fluid-xs text-muted">
              +{remaining}
            </li>
          )}
        </ul>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <Button to={ROUTES.order(order.id)} variant="outline" size="sm" magnetic={false}>
            View details
          </Button>
          <Button
            to={`${ROUTES.order(order.id)}#tracking`}
            variant="quiet"
            size="sm"
            magnetic={false}
          >
            Track order
          </Button>
        </div>
      </div>

      {order.estimatedDelivery && currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
        <p className="border-t border-line px-5 py-3 text-fluid-xs text-muted sm:px-6">
          Estimated delivery {formatDate(order.estimatedDelivery)}
        </p>
      )}
    </article>
  )
}

/** Links a product line back to its PDP when the slug survived the order. */
export function OrderLineItem({ item }) {
  const content = (
    <>
      <div className="h-24 w-18 shrink-0 overflow-hidden bg-surface-alt">
        <Image
          src={item.image}
          alt={item.name}
          ratio="auto"
          width={200}
          sizes="72px"
          className="h-full w-full"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-fluid-sm leading-snug">{item.name}</p>
        <p className="mt-1 text-fluid-xs text-muted">
          {[item.size && `Size ${item.size}`, item.color, `Qty ${item.quantity}`]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
      <p className="shrink-0 text-fluid-sm">{formatPrice(item.price * item.quantity)}</p>
    </>
  )

  return (
    <li className="flex items-center gap-4 border-b border-line py-4 last:border-b-0">
      {item.slug ? (
        <Link
          to={ROUTES.product(item.slug)}
          className="flex flex-1 items-center gap-4 transition-opacity duration-250 hover:opacity-75"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  )
}

export default OrderCard
