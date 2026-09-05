import { Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppLayout from './components/layout/AppLayout'
import PageTransition from './components/animations/PageTransition'
import ProtectedRoute from './components/common/ProtectedRoute'
import { Skeleton, ProductGridSkeleton } from './components/common/Skeleton'
import { routes } from './routes'

/** Shown while a lazily-loaded page chunk is in flight — never a blank screen. */
function RouteFallback() {
  return (
    <div className="shell section-y" role="status" aria-label="Loading page">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-6 h-12 w-2/3 max-w-xl" />
      <Skeleton className="mt-4 h-3 w-1/2 max-w-md" />
      <ProductGridSkeleton count={8} className="mt-16" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

/**
 * Route switch.
 *
 * The layout sits outside <Routes> so the navbar, drawers and overlays are not
 * remounted on navigation, and `AnimatePresence` is keyed on the pathname only —
 * query-string changes (filters, sort) must not replay the page transition.
 *
 * Each route carries its own <Suspense>. A boundary placed *above*
 * AnimatePresence would unmount the whole presence tree the moment a lazy page
 * chunk suspends mid-transition, and the incoming page would never appear.
 *
 * The auth guard wraps the <Suspense>, not the page, so a protected route
 * redirects without first downloading a chunk the visitor may not be allowed
 * to see.
 */
export default function App() {
  const location = useLocation()

  return (
    <AppLayout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {routes.map(({ path, Component, props, protected: isProtected }) => {
            const page = (
              <Suspense fallback={<RouteFallback />}>
                <Component {...props} />
              </Suspense>
            )

            return (
              <Route
                key={path}
                path={path}
                element={
                  <PageTransition>
                    {isProtected ? <ProtectedRoute>{page}</ProtectedRoute> : page}
                  </PageTransition>
                }
              />
            )
          })}
        </Routes>
      </AnimatePresence>
    </AppLayout>
  )
}
