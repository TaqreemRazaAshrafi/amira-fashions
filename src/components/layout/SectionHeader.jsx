import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import Reveal from '../animations/Reveal'
import TextReveal from '../animations/TextReveal'

/**
 * The heading block that opens every editorial section: eyebrow, serif title,
 * optional lede and an optional "view all" link. One component keeps the
 * vertical rhythm identical across the site.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  as = 'h2',
  className,
}) {
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-6 sm:mb-14',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn('max-w-2xl', centered && 'flex flex-col items-center')}>
        {eyebrow && (
          <Reveal as="p" className="eyebrow mb-4">
            {eyebrow}
          </Reveal>
        )}
        <TextReveal as={as} text={title} className="text-fluid-2xl" />
        {description && (
          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 max-w-prose text-fluid-sm leading-relaxed text-muted"
          >
            {description}
          </Reveal>
        )}
      </div>

      {action && (
        <Reveal delay={0.15} className={cn('shrink-0', centered && 'mt-2')}>
          <Link
            to={action.to}
            className="group inline-flex items-center gap-2 text-fluid-xs uppercase tracking-luxe transition-colors duration-250 hover:text-accent"
          >
            {action.label}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-400 ease-luxe group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </Reveal>
      )}
    </div>
  )
}

export default SectionHeader
