import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { cn } from '../../utils/cn'
import { PRIMARY_NAV, ROUTES } from '../../constants/routes'
import { useScrollState } from '../../hooks/useScroll'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { useAuthStore, selectIsAuthenticated } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import Logo from './Logo'
import NavLink from './NavLink'
import AnnouncementBar from './AnnouncementBar'
import MegaMenu from './MegaMenu'

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

/** Grace period before a mega menu closes, so a diagonal pointer path survives. */
const CLOSE_DELAY = 140

/**
 * Sticky primary navigation.
 *
 * Over a hero it starts transparent with light type, then swaps to a blurred
 * ivory bar once the visitor scrolls past the fold. It also retracts on
 * downward scroll deep in the page and returns the moment they scroll up.
 *
 * Department links open a mega menu. Opening is immediate but closing is
 * deferred by a short grace period: without it, the few pixels between the
 * trigger and the panel would close the menu mid-reach. While a menu is open the
 * header always takes its solid treatment — light type on a white panel would be
 * unreadable.
 */
export function Navbar({ transparent = false }) {
  const { scrolled, hidden } = useScrollState()
  const cartCount = useCartStore((state) => state.items.reduce((n, i) => n + i.quantity, 0))
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const lastAddedId = useCartStore((state) => state.lastAddedId)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const { openCart, openSearch, toggleMobileNav } = useUIStore()
  const { pathname, search } = useLocation()

  const [openMenu, setOpenMenu] = useState(null)
  const closeTimer = useRef(null)

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY)
  }, [cancelClose])

  const closeNow = useCallback(() => {
    cancelClose()
    setOpenMenu(null)
  }, [cancelClose])

  // Any navigation dismisses the menu, however it was triggered.
  useEffect(() => {
    closeNow()
  }, [pathname, search, closeNow])

  useEffect(() => cancelClose, [cancelClose])

  // Escape closes the menu without moving focus out of the header.
  useEffect(() => {
    if (!openMenu) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeNow()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openMenu, closeNow])

  // Brief pulse on the bag when a line is added.
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (!lastAddedId) return undefined
    setPulse(true)
    const timer = setTimeout(() => setPulse(false), 600)
    return () => clearTimeout(timer)
  }, [lastAddedId])

  const isOverlay = transparent && !scrolled && !openMenu
  const iconButton =
    'relative flex h-10 w-10 items-center justify-center transition-opacity duration-250 hover:opacity-60'

  return (
    <div className="fixed inset-x-0 top-0 z-[70]">
      <AnimatePresence>{!scrolled && <AnnouncementBar key="announcement" />}</AnimatePresence>

      <motion.header
        animate={{ y: hidden && !openMenu ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onMouseLeave={scheduleClose}
        className={cn(
          'relative transition-[background-color,color,border-color,backdrop-filter] duration-600 ease-luxe',
          isOverlay
            ? 'border-b border-transparent bg-transparent text-background'
            : 'glass border-b border-line text-text'
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[var(--nav-height)] max-w-shell items-center justify-between gap-2 px-gutter sm:gap-4"
        >
          {/* Left: mobile menu / desktop links. min-w-0 lets the link row
              shrink instead of pushing the wordmark off centre, and the gap only
              applies from lg — below that the link list is hidden and an empty
              gap is 28px of a 320px bar spent on nothing. */}
          <div className="flex min-w-0 flex-1 items-center gap-0 lg:gap-7">
            <button
              type="button"
              onClick={toggleMobileNav}
              aria-label="Open menu"
              className={cn(iconButton, '-ml-2.5 lg:hidden')}
            >
              <Menu className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
            </button>

            <ul className="hidden items-center gap-5 lg:flex xl:gap-8">
              {PRIMARY_NAV.map((item) => {
                const isMega = Boolean(item.department)
                const isOpen = openMenu === item.department

                return (
                  /* `onFocus` mirrors `onMouseEnter` so the panel is reachable
                     by keyboard, and the Sale link keeps full opacity — gold at
                     75% loses contrast against the ivory bar. */
                  <li
                    key={item.label}
                    onMouseEnter={() => {
                      cancelClose()
                      setOpenMenu(isMega ? item.department : null)
                    }}
                    onFocus={() => {
                      cancelClose()
                      setOpenMenu(isMega ? item.department : null)
                    }}
                  >
                    <NavLink
                      to={item.to}
                      aria-expanded={isMega ? isOpen : undefined}
                      aria-haspopup={isMega ? 'true' : undefined}
                      aria-controls={isMega ? `mega-${item.department}` : undefined}
                      emphasis={item.accent}
                      className={item.accent ? 'text-accent' : undefined}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Centre: wordmark */}
          <Logo className="shrink-0 lg:px-4" />

          {/* Right: utilities */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            <button type="button" onClick={openSearch} aria-label="Search" className={iconButton}>
              <Search className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
            </button>

            <Link
              to={isAuthenticated ? ROUTES.account : ROUTES.login}
              aria-label={isAuthenticated ? 'Your account' : 'Sign in'}
              className={cn(iconButton, 'hidden sm:flex')}
            >
              <User className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
            </Link>

            {/* Hidden on phones, where the bottom tab bar already carries it and
                the bar has no room to spare. */}
            <Link
              to={ROUTES.wishlist}
              aria-label={`Wishlist, ${wishlistCount} items`}
              className={cn(iconButton, 'hidden sm:flex')}
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
              <motion.span
                animate={pulse ? { scale: [1, 0.86, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
              </motion.span>
              <CountBadge count={cartCount} pulse={pulse} />
            </button>
          </div>
        </nav>

        {/* Mega menu lives inside the header so the pointer never leaves the
            hover region on its way down into the panel. */}
        <AnimatePresence>
          {openMenu && (
            <div className="hidden lg:block" onMouseEnter={cancelClose}>
              <MegaMenu
                key={openMenu}
                id={`mega-${openMenu}`}
                department={openMenu}
                onNavigate={closeNow}
              />
            </div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  )
}

export default Navbar
