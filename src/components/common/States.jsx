import { AlertCircle, PackageOpen, RefreshCw } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from './Button'

/**
 * Empty and error states.
 *
 * Both explain what happened in plain language and offer the next action —
 * never a bare "no results".
 */
export function EmptyState({
  icon: Icon = PackageOpen,
  title = 'Nothing here yet',
  description,
  action,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-20 text-center', className)}>
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface">
        <Icon className="h-6 w-6 text-accent" strokeWidth={1.2} aria-hidden="true" />
      </span>
      <h2 className="text-fluid-xl">{title}</h2>
      {description && (
        <p className="mt-3 max-w-sm text-fluid-sm leading-relaxed text-muted">{description}</p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong.',
  description = 'We could not load this content. Please try again in a moment.',
  onRetry,
  className,
}) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center px-6 py-20 text-center', className)}
    >
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-danger/25 bg-danger/5">
        <AlertCircle className="h-6 w-6 text-danger" strokeWidth={1.2} aria-hidden="true" />
      </span>
      <h2 className="text-fluid-xl">{title}</h2>
      <p className="mt-3 max-w-sm text-fluid-sm leading-relaxed text-muted">{description}</p>
      {onRetry && (
        <Button variant="outline" size="md" className="mt-8" icon={RefreshCw} iconPosition="left" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
