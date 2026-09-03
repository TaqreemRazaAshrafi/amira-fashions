import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { SITE } from '../../constants/site'

/**
 * Wordmark. Set in the display serif with wide tracking — the only place the
 * brand name is typeset this way.
 */
export function Logo({ className, size = 'md', onClick }) {
  // Tracking this wide is expensive in width: at 390px the full wordmark plus
  // the utility icons overruns the bar, so both step down on small screens.
  const sizes = {
    sm: 'text-[11px] tracking-[0.22em] sm:text-[13px] sm:tracking-[0.34em]',
    md: 'max-[359px]:text-[10px] max-[359px]:tracking-[0.12em] text-[12px] tracking-[0.2em] sm:text-[15px] sm:tracking-[0.3em] lg:text-[17px] lg:tracking-[0.34em]',
    lg: 'text-[18px] tracking-[0.26em] sm:text-[22px] sm:tracking-[0.32em]',
  }

  return (
    <Link
      to={ROUTES.home}
      onClick={onClick}
      aria-label={`${SITE.name} — home`}
      className={cn(
        'font-display font-normal uppercase leading-none transition-opacity duration-250 hover:opacity-70',
        sizes[size] ?? sizes.md,
        className
      )}
    >
      Amira<span className="text-accent"> </span>Fashions
    </Link>
  )
}

export default Logo
