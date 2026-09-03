import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'

/**
 * Primary nav item with the animated underline.
 * The rule grows from the right on hover and stays put on the active route.
 */
export function NavLink({ to, children, className, onClick }) {
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
        'link-underline py-1 text-fluid-xs uppercase tracking-luxe transition-opacity duration-250 hover:opacity-100',
        isActive ? 'opacity-100' : 'opacity-75',
        className
      )}
    >
      {children}
    </Link>
  )
}

export default NavLink
