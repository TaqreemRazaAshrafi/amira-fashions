import { cn } from '../../utils/cn'

/**
 * Infinite ticker. The content is rendered twice and translated by -50%, which
 * is what makes the loop seamless. Duplicates are hidden from assistive tech.
 */
export function Marquee({ items, className, separator = '·' }) {
  const row = (ariaHidden) => (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16"
    >
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-center gap-10 whitespace-nowrap sm:gap-16">
          <span>{item}</span>
          <span aria-hidden="true" className="text-accent">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className={cn('group relative flex overflow-hidden', className)}>
      <div className="flex animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

export default Marquee
