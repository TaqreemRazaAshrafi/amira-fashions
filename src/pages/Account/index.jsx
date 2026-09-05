import { Link } from 'react-router-dom'
import { Heart, MapPin, Package, ShoppingBag } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { formatPrice, pluralize } from '../../utils/format'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { useOrderStore } from '../../store/orderStore'
import { useUserStore } from '../../store/userStore'
import Button from '../../components/common/Button'
import { EmptyState } from '../../components/common/States'
import AccountLayout from '../../components/account/AccountLayout'
import OrderCard from '../../components/account/OrderCard'

/**
 * Account overview.
 *
 * A dashboard of counts that each link somewhere useful, plus the most recent
 * order. Everything is read from local stores, so this page never shows a
 * spinner — the detail screens do the fetching.
 */
export default function AccountPage() {
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const cartCount = useCartStore((state) => state.items.reduce((n, i) => n + i.quantity, 0))
  const cartItems = useCartStore((state) => state.items)
  const orders = useOrderStore((state) => state.orders)
  const addressCount = useUserStore((state) => state.addresses.length)

  const cartValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const latestOrder = orders[0] ?? null

  const tiles = [
    {
      id: 'orders',
      icon: Package,
      label: 'Orders',
      value: orders.length ? pluralize(orders.length, 'order') : 'No orders yet',
      to: ROUTES.accountOrders,
    },
    {
      id: 'wishlist',
      icon: Heart,
      label: 'Wishlist',
      value: `${wishlistCount} saved`,
      to: ROUTES.wishlist,
    },
    {
      id: 'bag',
      icon: ShoppingBag,
      label: 'Shopping bag',
      value: cartCount ? `${cartCount} in bag · ${formatPrice(cartValue)}` : 'Empty',
      to: ROUTES.cart,
    },
    {
      id: 'addresses',
      icon: MapPin,
      label: 'Addresses',
      value: addressCount ? pluralize(addressCount, 'address', 'addresses') : 'None saved',
      to: ROUTES.accountAddresses,
    },
  ]

  return (
    <AccountLayout
      title="Account"
      description="Your Amira Fashions account."
      canonicalPath={ROUTES.account}
    >
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {tiles.map(({ id, icon: Icon, label, value, to }) => (
          <li key={id}>
            <Link
              to={to}
              className="group flex h-full flex-col justify-between gap-8 border border-line bg-surface p-6 transition-colors duration-250 hover:border-text"
            >
              <Icon className="h-5 w-5 text-accent" strokeWidth={1.3} aria-hidden="true" />
              <span>
                <span className="block text-fluid-xs uppercase tracking-luxe text-muted">
                  {label}
                </span>
                <span className="mt-1 block text-fluid-lg">{value}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-14 border-t border-line pt-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-fluid-xl">Latest order</h2>
          {orders.length > 1 && (
            <Link
              to={ROUTES.accountOrders}
              className="text-fluid-xs uppercase tracking-wide text-muted underline-offset-4 hover:text-text hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {latestOrder ? (
          <OrderCard order={latestOrder} />
        ) : (
          <EmptyState
            title="No orders yet"
            description="Once you place an order it will appear here with its tracking link."
            action={
              <Button to={ROUTES.newArrivals} variant="outline">
                Shop new arrivals
              </Button>
            }
            className="py-14"
          />
        )}
      </section>
    </AccountLayout>
  )
}
