import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ACCOUNT_NAV, ROUTES } from '../../constants/routes'
import { formatDate } from '../../utils/format'
import { useAuthStore } from '../../store/authStore'
import { useUserStore } from '../../store/userStore'
import { useUIStore } from '../../store/uiStore'
import PageHero from '../layout/PageHero'
import Seo from '../common/Seo'

/**
 * Frame shared by every account screen.
 *
 * Each section is its own route and its own lazily-loaded chunk, so this layout
 * is rendered by the page rather than wrapping an <Outlet>. The trade is one
 * cheap re-render of the sidebar per navigation in exchange for keeping the
 * route table flat and every section independently code-split.
 *
 * Signing out clears the account records too — an address book must not outlive
 * the session that owns it, particularly on a shared device.
 */
export function AccountLayout({ title, description, canonicalPath, children }) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const clearUserRecords = useUserStore((state) => state.clear)
  const toast = useUIStore((state) => state.toast)

  const signOut = async () => {
    await logout()
    clearUserRecords()
    toast({ title: 'Signed out', variant: 'default' })
    navigate(ROUTES.home)
  }

  return (
    <>
      <Seo title={title} description={description} canonicalPath={canonicalPath} noIndex />

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
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <nav aria-label="Account sections">
            {/* A scrollable rail on phones, a sticky column from large up. */}
            <ul className="no-scrollbar -mx-gutter flex gap-2 overflow-x-auto px-gutter lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:mx-0 lg:flex-col lg:gap-0 lg:px-0">
              {ACCOUNT_NAV.map((item) => (
                <li key={item.to} className="shrink-0">
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'block whitespace-nowrap border px-4 py-2.5 text-fluid-xs uppercase tracking-wide transition-colors duration-250 lg:border-0 lg:border-l lg:px-4 lg:py-3',
                        isActive
                          ? 'border-text bg-text text-background lg:bg-transparent lg:text-text'
                          : 'border-line text-muted hover:border-text hover:text-text'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="shrink-0 lg:mt-6 lg:border-t lg:border-line lg:pt-4">
                <button
                  type="button"
                  onClick={signOut}
                  className="flex items-center gap-2 whitespace-nowrap border border-line px-4 py-2.5 text-fluid-xs uppercase tracking-wide text-muted transition-colors duration-250 hover:border-text hover:text-text lg:border-0 lg:px-4 lg:py-3"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </>
  )
}

export default AccountLayout
