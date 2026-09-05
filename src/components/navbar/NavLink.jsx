import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'

/**
 * Primary nav item with the animated underline.
 * The rule grows from the right on hover and stays put on the active route.
 *
 * Extra props are forwarded to the anchor so callers can attach ARIA state — the
 * mega-menu triggers need `aria-expanded`/`aria-controls` to land on the real
 * element rather than being silently dropped.
 */
/**
 * @param {boolean} [emphasis] keeps the link at full opacity. `cn` is a plain
 *   joiner, so an `opacity-100` passed through `className` would merely sit
 *   beside the base `opacity-75` and let stylesheet order decide the winner —
 *   the choice has to be made here, where only one class is emitted.
 */
export function NavLink({ to, children, className, onClick, emphasis = false, ...rest }) {
  const { pathname, search } = useLocation()
  const [path, query] = to.split('?')
  const isActive = query
    ? pathname === path && search.includes(query)
    : pathname === path || (path !== '/' && pathname.startsWith(`${path}/`))

  return (
    <Link
      to={to}
      onClick={onClick}
      data-active={isActive}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        // Nav items must never wrap: a two-line label breaks the bar's height
        // and pushes the wordmark off centre.
        'link-underline whitespace-nowrap py-1 text-fluid-xs uppercase tracking-luxe transition-opacity duration-250 hover:opacity-100',
        isActive || emphasis ? 'opacity-100' : 'opacity-75',
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  )
}

export default NavLink
