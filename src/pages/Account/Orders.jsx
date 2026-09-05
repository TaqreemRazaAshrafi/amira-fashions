import { useCallback } from 'react'
import { Package } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { useAsync } from '../../hooks/useAsync'
import { useOrderStore } from '../../store/orderStore'
import orderService from '../../services/orderService'
import Button from '../../components/common/Button'
import { EmptyState, ErrorState } from '../../components/common/States'
import { Skeleton } from '../../components/common/Skeleton'
import AccountLayout from '../../components/account/AccountLayout'
import OrderCard from '../../components/account/OrderCard'

function OrdersSkeleton() {
  return (
    <ul className="flex flex-col gap-4" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <li key={index} className="border border-line bg-surface p-6">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-3 h-6 w-40" />
          <Skeleton className="mt-6 h-16 w-48" />
        </li>
      ))}
    </ul>
  )
}

/**
 * Order history.
 *
 * Reads through the order service so the swap to a real `GET /orders` is a
 * one-line change; behind the mock adapter the locally recorded orders are
 * handed in, because there is no server holding them.
 */
export default function AccountOrdersPage() {
  const orders = useOrderStore((state) => state.orders)

  const fetcher = useCallback(() => orderService.list({ localOrders: orders }), [orders])
  const { data, isLoading, isError, retry } = useAsync(fetcher, [orders.length])

  const items = data?.items ?? []

  return (
    <AccountLayout
      title="My Orders"
      description="Track and review your Amira Fashions orders."
      canonicalPath={ROUTES.accountOrders}
    >
      <h2 className="text-fluid-xl">My Orders</h2>
      <p className="mt-3 max-w-prose text-fluid-sm leading-relaxed text-muted">
        Every order you have placed, newest first, with its live status.
      </p>

      <div className="mt-10">
        {isLoading && <OrdersSkeleton />}

        {isError && (
          <ErrorState
            title="We could not load your orders."
            description="Something went wrong on the way. Please try again."
            onRetry={retry}
          />
        )}

        {!isLoading && !isError && items.length === 0 && (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Once you place an order it will appear here with its tracking link."
            action={
              <Button to={ROUTES.newArrivals} variant="outline">
                Start shopping
              </Button>
            }
            className="py-16"
          />
        )}

        {!isLoading && !isError && items.length > 0 && (
          <ul className="flex flex-col gap-4">
            {items.map((order) => (
              <li key={order.id}>
                <OrderCard order={order} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </AccountLayout>
  )
}
