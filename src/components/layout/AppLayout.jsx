import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useUIStore } from '../../store/uiStore'
import Navbar from '../navbar/Navbar'
import MobileNav from '../navbar/MobileNav'
import Footer from '../footer/Footer'
import CartDrawer from '../cart/CartDrawer'
import SearchOverlay from '../search/SearchOverlay'
import QuickViewModal from '../product/QuickViewModal'
import CustomCursor from '../animations/CustomCursor'
import ScrollToTop from '../common/ScrollToTop'
import Toaster from '../common/Toaster'
import ErrorBoundary from '../common/ErrorBoundary'

/**
 * The application shell.
 *
 * Rendered once, outside the route switch, so the navbar keeps its scroll state
 * and the overlays survive navigation — only the routed content inside <main>
 * changes. The navbar is fixed, so every page except the home hero has to
 * reserve the space it occupies.
 */
export function AppLayout({ children }) {
  const { pathname } = useLocation()
  const closeAll = useUIStore((state) => state.closeAll)
  const isHome = pathname === ROUTES.home

  // An overlay left open during navigation would float over the wrong page.
  useEffect(() => {
    closeAll()
  }, [pathname, closeAll])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[110] bg-text px-4 py-2 text-fluid-xs uppercase tracking-luxe text-background"
      >
        Skip to content
      </a>

      <ScrollToTop />
      <Navbar transparent={isHome} />
      <MobileNav />
      <SearchOverlay />
      <CartDrawer />
      <QuickViewModal />
      <CustomCursor />

      <main id="main" className={isHome ? 'flex-1' : 'flex-1 pt-[calc(var(--nav-height)+2.25rem)]'}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}

export default AppLayout
