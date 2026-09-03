import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { cn } from '../../utils/cn'
import { PRIMARY_NAV, ROUTES } from '../../constants/routes'
import { useScrollState } from '../../hooks/useScroll'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { useUIStore } from '../../store/uiStore'
import Logo from './Logo'
import NavLink from './NavLink'
import AnnouncementBar from './AnnouncementBar'

/** Count bubble shared by the cart and wishlist triggers. */
function CountBadge({ count, pulse }) {
  if (!count) return null
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: pulse ? [1, 1.35, 1] : 1, opacity: 1 }}
      transition={{ duration: pulse ? 0.45 : 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-medium leading-none text-background"
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  )
}

/**
 * Sticky primary navigation.
 *
 * Over a hero it starts transparent with light type, then swaps to a blurred
 * ivory bar once the visitor scrolls past the fold. It also retracts on
 * downward scroll deep in the page and returns the moment they scroll up.
 */
export function Navbar({ transparent = false }) {
  const { scrolled, hidden } = useScrollState()
  const cartCount = useCartStore((state) => state.items.reduce((n, i) => n + i.quantity, 0))
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const lastAddedId = useCartStore((state) => state.lastAddedId)
  const { openCart, openSearch, toggleMobileNav } = useUIStore()

  // Brief pulse on the bag when a line is added.
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (!lastAddedId) return undefined
    setPulse(true)
    const timer = setTimeout(() => setPulse(false), 600)
    return () => clearTimeout(timer)
  }, [lastAddedId])

  const isOverlay = transparent && !scrolled
  const iconButton =
    'relative flex h-10 w-10 items-center justify-center transition-opacity duration-250 hover:opacity-60'

  return (
    <div className="fixed inset-x-0 top-0 z-[70]">
      <AnimatePresence>{!scrolled && <AnnouncementBar key="announcement" />}</AnimatePresence>

      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'transition-[background-color,color,border-color,backdrop-filter] duration-600 ease-luxe',
          isOverlay
            ? 'border-b border-transparent bg-transparent text-background'
            : 'glass border-b border-line text-text'
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[var(--nav-height)] max-w-shell items-center justify-between gap-4 px-gutter"
        >
          {/* Left: mobile menu / desktop links */}
          <div className="flex flex-1 items-center gap-7">
            <button
              type="button"
              onClick={toggleMobileNav}
              aria-label="Open menu"
              className={cn(iconButton, '-ml-2.5 lg:hidden')}
            >
              <Menu className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
            </button>

            <ul className="hidden items-center gap-8 lg:flex">
              {PRIMARY_NAV.map((item) => (
                <li key={item.label}>
                  <NavLink to={item.to}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Centre: wordmark */}
          <Logo className="shrink-0" />

          {/* Right: utilities */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            <button type="button" onClick={openSearch} aria-label="Search" className={iconButton}>
              <Search className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
            </button>

            <Link
              to={ROUTES.account}
              aria-label="Account"
              className={cn(iconButton, 'hidden sm:flex')}
            >
              <User className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
            </Link>

            <Link
              to={ROUTES.wishlist}
              aria-label={`Wishlist, ${wishlistCount} items`}
              className={iconButton}
            >
              <Heart className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
              <CountBadge count={wishlistCount} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Shopping bag, ${cartCount} items`}
              className={cn(iconButton, '-mr-2.5')}
            >
              <motion.span animate={pulse ? { scale: [1, 0.86, 1.08, 1] } : { scale: 1 }} transition={{ duration: 0.5 }}>
                <ShoppingBag className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
              </motion.span>
              <CountBadge count={cartCount} pulse={pulse} />
            </button>
          </div>
        </nav>
      </motion.header>
    </div>
  )
}

export default Navbar
