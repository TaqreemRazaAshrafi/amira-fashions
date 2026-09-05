import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronRight, LogOut, Package, User } from 'lucide-react'
import { cn } from '../../utils/cn'
import Drawer from '../common/Drawer'
import { InstagramIcon } from '../common/BrandIcons'
import { ROUTES } from '../../constants/routes'
import { CONTACT, INSTAGRAM_HANDLE } from '../../constants/site'
import { QUERY_KEYS } from '../../constants/filters'
import { categoryGroupsFor } from '../../data/categories'
import { departments } from '../../data/departments'
import { useUIStore } from '../../store/uiStore'
import { useAuthStore, selectIsAuthenticated } from '../../store/authStore'

const item = {
  hidden: { opacity: 0, x: -18 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.06 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

const EDITORIAL = [
  { label: 'New Arrivals', to: ROUTES.newArrivals },
  { label: 'Best Sellers', to: ROUTES.bestSellers },
  { label: 'Sale', to: ROUTES.sale, accent: true },
  { label: 'Collections', to: ROUTES.collections },
]

/**
 * Full-height mobile menu.
 *
 * Deliberately not a shrunken desktop nav: departments are tabs at the top and
 * their categories fill the panel below, so reaching a category is two taps
 * rather than a scroll through everything both departments sell. Closes itself
 * whenever the route changes.
 */
export function MobileNav() {
  const isOpen = useUIStore((state) => state.isMobileNavOpen)
  const close = useUIStore((state) => state.closeMobileNav)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const { pathname, search } = useLocation()

  const [activeDepartment, setActiveDepartment] = useState(departments[0]?.slug)

  useEffect(() => {
    close()
  }, [pathname, search, close])

  const columns = categoryGroupsFor(activeDepartment)

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      side="left"
      title="Menu"
      className="max-w-[min(92vw,420px)]"
    >
      <div className="flex min-h-full flex-col">
        {/* Department tabs. Sticky rather than in a nested scroller: the Drawer
            already owns the scroll, and two scroll containers would fight. */}
        <div
          role="tablist"
          aria-label="Departments"
          className="sticky top-0 z-10 flex border-b border-line bg-background"
        >
          {departments.map((department) => {
            const isActive = activeDepartment === department.slug
            return (
              <button
                key={department.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveDepartment(department.slug)}
                className={cn(
                  '-mb-px flex-1 border-b-2 px-4 py-4 text-fluid-xs uppercase tracking-luxe transition-colors duration-250',
                  isActive ? 'border-text text-text' : 'border-transparent text-muted'
                )}
              >
                {department.name}
              </button>
            )
          })}
        </div>

        <div className="flex-1 px-6 py-6">
          <Link
            to={`${ROUTES.shop}?${QUERY_KEYS.department}=${activeDepartment}`}
            onClick={close}
            className="flex items-center justify-between border-b border-line py-3 font-display text-fluid-xl"
          >
            Shop all
            <ChevronRight className="h-4 w-4 text-muted" aria-hidden="true" />
          </Link>

          {columns.map((column, columnIndex) => (
            <div key={column.group} className="mt-7">
              <p className="eyebrow mb-3">{column.group}</p>
              <ul className="flex flex-col">
                {column.items.map((category, index) => (
                  <motion.li
                    key={category.id}
                    custom={columnIndex * 3 + index}
                    variants={item}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={ROUTES.departmentCategory(category.department, category.slug)}
                      onClick={close}
                      className="flex items-center justify-between py-2.5 text-fluid-base text-muted transition-colors duration-250 hover:text-text"
                    >
                      {category.name}
                      <ChevronRight className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-9 border-t border-line pt-7">
            <p className="eyebrow mb-3">Explore</p>
            <ul className="flex flex-col">
              {EDITORIAL.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={close}
                    className={cn(
                      'block py-2.5 text-fluid-base transition-colors duration-250 hover:text-text',
                      link.accent ? 'text-accent' : 'text-muted'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-9 border-t border-line pt-7">
            <ul className="flex flex-col">
              <li>
                <Link
                  to={isAuthenticated ? ROUTES.account : ROUTES.login}
                  onClick={close}
                  className="flex items-center gap-3 py-2.5 text-fluid-base text-muted transition-colors duration-250 hover:text-text"
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  {isAuthenticated ? 'Your account' : 'Sign in or create account'}
                </Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link
                      to={ROUTES.accountOrders}
                      onClick={close}
                      className="flex items-center gap-3 py-2.5 text-fluid-base text-muted transition-colors duration-250 hover:text-text"
                    >
                      <Package className="h-4 w-4" aria-hidden="true" />
                      My orders
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={async () => {
                        await logout()
                        close()
                      }}
                      className="flex w-full items-center gap-3 py-2.5 text-left text-fluid-base text-muted transition-colors duration-250 hover:text-text"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </button>
                  </li>
                </>
              )}
              <li>
                <Link
                  to={ROUTES.about}
                  onClick={close}
                  className="block py-2.5 text-fluid-base text-muted transition-colors duration-250 hover:text-text"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.contact}
                  onClick={close}
                  className="block py-2.5 text-fluid-base text-muted transition-colors duration-250 hover:text-text"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line px-6 py-6">
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noreferrer noopener"
            className="group flex items-center justify-between text-fluid-xs uppercase tracking-luxe"
          >
            <span className="flex items-center gap-2">
              <InstagramIcon className="h-4 w-4" />@{INSTAGRAM_HANDLE}
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a href={`mailto:${CONTACT.email}`} className="text-fluid-xs text-muted">
            {CONTACT.email}
          </a>
        </div>
      </div>
    </Drawer>
  )
}

export default MobileNav
