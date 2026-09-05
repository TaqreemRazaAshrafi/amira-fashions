import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Check, Package } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { formatDate, formatPrice, pluralize } from '../../utils/format'
import { useAsync } from '../../hooks/useAsync'
import { useOrderStore } from '../../store/orderStore'
import orderService, { ORDER_STATUS_LABELS, trackingFor } from '../../services/orderService'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import { EmptyState, ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeleton'
import PageHero from '../../components/layout/PageHero'
import { OrderLineItem } from '../../components/account/OrderCard'
import { formatAddress } from '../../components/account/AddressForm'

/** Vertical fulfilment timeline. Completed steps are marked, not merely coloured. */
function TrackingTimeline({ order }) {
  const { steps, currentStatus } = trackingFor(order)

  if (currentStatus === 'cancelled') {
    return (
      <p className="border border-line bg-surface-alt p-5 text-fluid-sm text-muted">
        This order was cancelled. If you were charged, the refund reaches your original payment
        method within 5–7 business days.
      </p>
    )
  }

  return (
    <ol className="relative flex flex-col gap-6 border-l border-line pl-8">
      {steps.map((step) => (
        <li key={step.status} className="relative">
          <span
            aria-hidden="true"
            className={cn(
              'absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border-2',
              step.complete
                ? 'border-accent bg-accent text-background'
                : 'border-line bg-background'
            )}
          >
            {step.complete && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
          <p className={cn('text-fluid-sm', step.complete ? 'text-text' : 'text-muted')}>
            {step.label}
            {step.status === currentStatus && (
              <span className="ml-2 text-fluid-xs uppercase tracking-luxe text-accent">
                Current
              </span>
            )}
          </p>
          <p className="mt-0.5 text-fluid-xs text-muted">
            {step.complete ? formatDate(step.at) : `Expected ${formatDate(step.at)}`}
          </p>
        </li>
      ))}
    </ol>
  )
}

function OrderDetailSkeleton() {
  return (
    <div className="shell pb-section pt-12" aria-hidden="true">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-6 h-10 w-64" />
      <Skeleton className="mt-10 h-48 w-full" />
    </div>
  )
}

/**
 * A single order: its contents, totals, delivery address, payment and tracking.
 *
 * Reads through the order service — behind the mock adapter the locally recorded
 * orders are handed in, because nothing server-side is holding them yet.
 */
export default function OrderDetailPage() {
  const { id } = useParams()
  const orders = useOrderStore((state) => state.orders)

  const fetcher = useCallback(
    () => orderService.getById(id, { localOrders: orders }),
    [id, orders]
  )
  const { data: order, isLoading, isError, error, retry } = useAsync(fetcher, [id, orders.length])

  if (isLoading) return <OrderDetailSkeleton />

  if (isError) {
    const notFound = error?.status === 404
    return (
      <div className="shell pb-section pt-12">
        {notFound ? (
          <EmptyState
            icon={Package}
            title="We could not find that order"
            description="Check the order number, or open it from your order history."
            action={
              <Button to={ROUTES.accountOrders} variant="outline">
                View order history
              </Button>
            }
            className="py-20"
          />
        ) : (
          <ErrorState
            title="We could not load this order."
            description="Something went wrong on the way. Please try again."
            onRetry={retry}
          />
        )}
      </div>
    )
  }

  const items = order.items ?? []
  const { currentStatus } = trackingFor(order)

  return (
    <>
      <Seo
        title={`Order ${order.id}`}
        description={`Details and tracking for Amira Fashions order ${order.id}.`}
        canonicalPath={ROUTES.order(order.id)}
        noIndex
      />

      <PageHero
        eyebrow={`Placed ${formatDate(order.placedAt)}`}
        title={`Order ${order.id}`}
        description={`${pluralize(items.length, 'item')} · ${ORDER_STATUS_LABELS[currentStatus] ?? currentStatus}`}
        breadcrumbs={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Orders', to: ROUTES.accountOrders },
          { label: order.id, to: ROUTES.order(order.id) },
        ]}
      />

      <div className="shell pb-section">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div className="min-w-0">
            <section>
              <h2 className="text-fluid-lg">Items</h2>
              <ul className="mt-4 border-t border-line">
                {items.map((item) => (
                  <OrderLineItem key={item.id} item={item} />
                ))}
              </ul>
            </section>

            <section id="tracking" className="mt-14 scroll-mt-28 border-t border-line pt-10">
              <h2 className="text-fluid-lg">Tracking</h2>
              <p className="mb-8 mt-2 text-fluid-sm text-muted">
                {currentStatus === 'delivered'
                  ? 'Delivered. We hope it was worth the wait.'
                  : `Estimated delivery ${formatDate(order.estimatedDelivery)}.`}
              </p>
              <TrackingTimeline order={order} />
            </section>
          </div>

          <aside className="flex flex-col gap-8">
            <section className="border border-line bg-surface p-6">
              <h2 className="text-fluid-lg">Summary</h2>
              <dl className="mt-5 flex flex-col gap-3 text-fluid-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(order.totals?.subtotal ?? 0)}</dd>
                </div>
                {order.totals?.discount > 0 && (
                  <div className="flex justify-between gap-4 text-success">
                    <dt>Discount{order.coupon?.code ? ` (${order.coupon.code})` : ''}</dt>
                    <dd className="tabular-nums">−{formatPrice(order.totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="tabular-nums">
                    {order.totals?.shipping ? formatPrice(order.totals.shipping) : 'Complimentary'}
                  </dd>
                </div>
                {order.totals?.tax > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Tax</dt>
                    <dd className="tabular-nums">{formatPrice(order.totals.tax)}</dd>
                  </div>
                )}
                <div className="mt-2 flex justify-between gap-4 border-t border-line pt-3 text-fluid-base">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatPrice(order.totals?.total ?? 0)}</dd>
                </div>
              </dl>
            </section>

            {order.address && (
              <section className="border border-line bg-surface p-6">
                <h2 className="text-fluid-lg">Delivery address</h2>
                <p className="mt-4 text-fluid-sm">{order.customer?.name}</p>
                <p className="mt-1 text-fluid-sm leading-relaxed text-muted">
                  {formatAddress(order.address)}
                </p>
                {order.customer?.phone && (
                  <p className="mt-1 text-fluid-sm text-muted">{order.customer.phone}</p>
                )}
              </section>
            )}

            <section className="border border-line bg-surface p-6">
              <h2 className="text-fluid-lg">Payment</h2>
              <p className="mt-4 text-fluid-sm">
                {order.payment?.method === 'cod' ? 'Cash on delivery' : 'Paid online'}
              </p>
              <p className="mt-1 text-fluid-xs uppercase tracking-wide text-muted">
                {order.payment?.status === 'paid' ? 'Payment received' : 'Due on delivery'}
              </p>
              {order.payment?.reference && (
                <p className="mt-2 break-all text-fluid-xs text-muted">
                  Ref {order.payment.reference}
                </p>
              )}
            </section>

            <Button to={ROUTES.accountOrders} variant="outline" fullWidth magnetic={false}>
              Back to orders
            </Button>
          </aside>
        </div>
      </div>
    </>
  )
}
