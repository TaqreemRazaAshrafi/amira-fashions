import { cn } from '../../utils/cn'
import Image from '../common/Image'
import Reveal from '../animations/Reveal'
import TextReveal from '../animations/TextReveal'
import Breadcrumbs from '../common/Breadcrumbs'

/**
 * Header band for interior pages.
 *
 * With an `image` it renders as a full-bleed editorial banner with light type;
 * without one it falls back to a quiet type-only header, which is the right
 * treatment for utility pages (cart, checkout, account).
 */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  breadcrumbs,
  align = 'left',
  height = 'md',
  children,
  className,
}) {
  const heights = {
    sm: 'min-h-[34vh] sm:min-h-[38vh]',
    md: 'min-h-[46vh] sm:min-h-[56vh]',
    lg: 'min-h-[62vh] sm:min-h-[72vh]',
  }
  const centered = align === 'center'

  if (!image) {
    return (
      <header
        className={cn('shell pb-10 pt-12 sm:pb-14 sm:pt-16', centered && 'text-center', className)}
      >
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-6" />}
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <TextReveal as="h1" text={title} className="text-fluid-3xl" />
        {description && (
          <Reveal
            as="p"
            delay={0.1}
            className={cn(
              'mt-5 max-w-prose text-fluid-sm leading-relaxed text-muted',
              centered && 'mx-auto'
            )}
          >
            {description}
          </Reveal>
        )}
        {children}
      </header>
    )
  }

  return (
    <header className={cn('grain relative isolate overflow-hidden bg-text text-background', className)}>
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          ratio="auto"
          width={1800}
          sizes="100vw"
          priority
          className="h-full w-full"
          imgClassName="opacity-70"
        />
        {/* A bright photograph washes out light type at the top of the frame,
            where the breadcrumbs sit, so the scrim keeps weight up there too. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-text/90 via-text/50 to-text/45"
        />
      </div>

      <div
        className={cn(
          // The layout already offsets <main> past the fixed navbar, so this
          // only needs its own breathing room.
          'shell relative z-20 flex flex-col justify-end pb-12 pt-16 sm:pb-16 sm:pt-20',
          heights[height] ?? heights.md,
          centered && 'items-center text-center'
        )}
      >
        {/* Breadcrumbs mark the current page with the ink colour; over a
            photograph that reads as invisible, so it is lifted here. */}
        {breadcrumbs && (
          <Breadcrumbs
            items={breadcrumbs}
            className="mb-6 text-background/85 [&_[aria-current]]:text-background"
          />
        )}
        {eyebrow && <p className="eyebrow mb-4 text-background/70">{eyebrow}</p>}
        <TextReveal as="h1" text={title} className="max-w-4xl text-fluid-3xl" />
        {description && (
          <Reveal
            as="p"
            delay={0.12}
            className={cn(
              'mt-5 max-w-prose text-fluid-sm leading-relaxed text-background/80',
              centered && 'mx-auto'
            )}
          >
            {description}
          </Reveal>
        )}
        {children}
      </div>
    </header>
  )
}

export default PageHero
