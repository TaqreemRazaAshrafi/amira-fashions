import { useLocation } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useAuthStore, selectIsAuthenticated } from '../../store/authStore'
import Redirect from './Redirect'

/**
 * Route guard for pages that require a signed-in account.
 *
 * Sends the visitor to sign-in carrying the path they were trying to reach, so
 * signing in returns them there rather than dumping them on the account page.
 * The full location (path + query) is preserved, which matters for links like
 * `/orders/AF12345678`.
 *
 * This is a UX guard, not a security boundary: the server must still reject
 * unauthenticated requests. Client-side routing can always be bypassed.
 */
export function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Redirect to={ROUTES.login} state={{ from: `${location.pathname}${location.search}` }} />
    )
  }

  return children
}

export default ProtectedRoute
