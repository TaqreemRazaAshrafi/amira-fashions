import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, LogOut, Package, ShoppingBag } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { formatDate } from '../../utils/format'
import { useAsync } from '../../hooks/useAsync'
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed'
import productService from '../../services/productService'
import { useAuthStore, selectIsAuthenticated } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import { EmptyState } from '../../components/common/States'
import Redirect from '../../components/common/Redirect'
import PageHero from '../../components/layout/PageHero'
import SectionHeader from '../../components/layout/SectionHeader'
import ProductRail from '../../components/product/ProductRail'

/** Module-scope so the redirect effect sees a stable object identity. */
const LOGIN_REDIRECT_STATE = { from: ROUTES.account }

/**
 * Account overview.
 *
 * Order history is intentionally a placeholder: it needs a real backend, and
 * inventing mock orders here would mislead. Everything else — wishlist, bag,
 * recently viewed — is live from local state.
 */
export default function AccountPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const wishlistCount = useWishlistStore((state) => state.items.length)
  const cartCount = useCartStore((state) => state.items.reduce((n, i) => n + i.quantity, 0))

  const { slugs } = useRecentlyViewed()
  const fetcher = useCallback(async () => {
    const results = await Promise.allSettled(slugs.map((slug) => productService.getBySlug(slug)))
    return results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
  }, [slugs])
  const { data: recentlyViewed } = useAsync(fetcher, [slugs.join(',')])

  if (!isAuthenticated) {
    return <Redirect to={ROUTES.login} state={LOGIN_REDIRECT_STATE} />
  }

  const signOut = async () => {
    await logout()
    navigate(ROUTES.home)
  }

  const tiles = [
    {
      id: 'wishlist',
      icon: Heart,
      label: 'Wishlist',
      value: `${wishlistCount} saved`,
      to: ROUTES.wishlist,
    },
    { id: 'bag', icon: ShoppingBag, label: 'Shopping bag', value: `${cartCount} in bag`, to: ROUTES.cart },
    { id: 'orders', icon: Package, label: 'Orders', value: 'No orders yet', to: ROUTES.shop },
  ]

  return (
    <>
      <Seo
        title="Account"
        description="Your Amira Fashions account."
        canonicalPath={ROUTES.account}
        noIndex
      />

      <PageHero
        eyebrow={user?.createdAt ? `Member since ${formatDate(user.createdAt)}` : 'Your account'}
        title={user?.name ? `Hello, ${user.name}` : 'Your account'}
        description={user?.email}
        breadcrumbs={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Account', to: ROUTES.account },
        ]}
      />

      <div className="shell pb-section">
        <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
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

        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-fluid-xl">Order history</h2>
          <EmptyState
            title="No orders yet"
            description="Once you place an order it will appear here with its tracking link."
            action={
              <Button to={ROUTES.collection('new-arrivals')} variant="outline">
                Shop new arrivals
              </Button>
            }
            className="py-14"
          />
        </section>

        {recentlyViewed?.length > 0 && (
          <section className="mt-16 border-t border-line pt-14">
            <SectionHeader
              eyebrow="Picking up where you left off"
              title="Recently viewed"
              action={{ label: 'Shop all', to: ROUTES.shop }}
            />
            <ProductRail products={recentlyViewed} />
          </section>
        )}

        <div className="mt-16 border-t border-line pt-10">
          <Button variant="quiet" icon={LogOut} iconPosition="left" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    </>
  )
}
