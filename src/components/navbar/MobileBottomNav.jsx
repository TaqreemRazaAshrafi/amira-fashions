import { Link, useLocation } from 'react-router-dom'
import { Heart, Home, LayoutGrid, ShoppingBag, User } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { useAuthStore, selectIsAuthenticated } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'

/** Small count bubble on the wishlist and bag tabs. */
function TabBadge({ count }) {
  if (!count) return null
  return (
    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-medium leading-none text-background">
      {count > 99 ? '99+' : count}
    </span>
  )
}

/**
 * Phone-only bottom navigation.
 *
 * The five destinations a shopper reaches for most, within thumb range. It is
 * hidden from `lg` up, where the header already carries the same actions.
 *
 * Categories opens the mobile menu rather than navigating, which is what makes
 * the department tabs one tap away from anywhere in the app. Bottom padding
 * respects the iOS home indicator via `env(safe-area-inset-bottom)`.
 */
export function MobileBottomNav() {
  const { pathname } = useLocation()
  const cartCount = useCartStore((state) => state.items.reduce((n, i) => n + i.quantity, 0))
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const toggleMobileNav = useUIStore((state) => state.toggleMobileNav)
  const isMobileNavOpen = useUIStore((state) => state.isMobileNavOpen)

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, to: ROUTES.home },
    { id: 'categories', label: 'Categories', icon: LayoutGrid, action: toggleMobileNav },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, to: ROUTES.wishlist, count: wishlistCount },
    { id: 'cart', label: 'Bag', icon: ShoppingBag, to: ROUTES.cart, count: cartCount },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      to: isAuthenticated ? ROUTES.account : ROUTES.login,
    },
  ]

  const tabClass =
    'relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] uppercase tracking-wide transition-colors duration-250'

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-background/95 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="mx-auto flex max-w-shell items-stretch">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.to
            ? tab.to === ROUTES.home
              ? pathname === ROUTES.home
              : pathname.startsWith(tab.to)
            : isMobileNavOpen

          const content = (
            <>
              <span className="relative">
                <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                <TabBadge count={tab.count} />
              </span>
              {tab.label}
            </>
          )

          return (
            <li key={tab.id} className="flex flex-1">
              {tab.to ? (
                <Link
                  to={tab.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(tabClass, isActive ? 'text-text' : 'text-muted')}
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={tab.action}
                  aria-expanded={isMobileNavOpen}
                  className={cn(tabClass, isActive ? 'text-text' : 'text-muted')}
                >
                  {content}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MobileBottomNav
