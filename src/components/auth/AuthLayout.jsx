import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { photo } from '../../utils/images'
import Image from '../common/Image'

const COVER = photo('1509319117193-57bab727e09d')

/**
 * The split-screen frame every authentication screen sits in.
 *
 * The photograph is decorative and hidden from assistive technology; it is also
 * dropped entirely below `lg`, where the form deserves the full width rather
 * than competing with an image for it.
 */
export function AuthLayout({ eyebrow, title, description, children, footer, className }) {
  return (
    <div className="grid min-h-[70vh] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src={COVER}
          alt=""
          ratio="auto"
          width={1200}
          sizes="50vw"
          priority
          className="absolute inset-0 h-full w-full"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-text/25" />
      </div>

      <div className="flex items-center justify-center px-gutter py-16 sm:py-24">
        <div className={cn('w-full max-w-md', className)}>
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-fluid-2xl">{title}</h1>
          {description && (
            <p className="mt-4 text-fluid-sm leading-relaxed text-muted">{description}</p>
          )}

          {children}

          {footer && <div className="mt-8 text-fluid-sm text-muted">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

/** Inline link styled for the small print under an auth form. */
export function AuthLink({ to, children, state }) {
  return (
    <Link
      to={to}
      state={state}
      className="text-text underline decoration-line underline-offset-4 transition-colors duration-250 hover:decoration-accent"
    >
      {children}
    </Link>
  )
}

export default AuthLayout
