import { forwardRef, useId } from 'react'
import { cn } from '../../utils/cn'

/**
 * Form primitives.
 *
 * Each control is a forwardRef so `{...register('name')}` from React Hook Form
 * works directly. Errors are wired with aria-invalid + aria-describedby, and
 * the message is announced politely rather than only turning the border red.
 */
function FieldShell({ id, label, error, hint, required, className, children }) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ')

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label htmlFor={id} className="text-fluid-xs uppercase tracking-wide text-muted">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-accent">
              *
            </span>
          )}
        </label>
      )}
      {children(describedBy || undefined)}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-fluid-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-fluid-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

const controlClasses =
  'w-full border-b border-line bg-transparent py-3 text-fluid-base text-text placeholder:text-muted/70 transition-colors duration-250 focus:border-accent focus:outline-none disabled:opacity-50'

export const TextField = forwardRef(function TextField(
  { label, error, hint, required, className, id: providedId, ...rest },
  ref
) {
  const generatedId = useId()
  const id = providedId || `field-${generatedId}`

  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      {(describedBy) => (
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(controlClasses, error && 'border-danger')}
          {...rest}
        />
      )}
    </FieldShell>
  )
})

export const TextArea = forwardRef(function TextArea(
  { label, error, hint, required, className, rows = 4, id: providedId, ...rest },
  ref
) {
  const generatedId = useId()
  const id = providedId || `field-${generatedId}`

  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      {(describedBy) => (
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(controlClasses, 'resize-none', error && 'border-danger')}
          {...rest}
        />
      )}
    </FieldShell>
  )
})

export const SelectField = forwardRef(function SelectField(
  { label, error, hint, required, className, options = [], id: providedId, ...rest },
  ref
) {
  const generatedId = useId()
  const id = providedId || `field-${generatedId}`

  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      {(describedBy) => (
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(controlClasses, 'cursor-pointer', error && 'border-danger')}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  )
})

export const Checkbox = forwardRef(function Checkbox({ label, className, id: providedId, ...rest }, ref) {
  const generatedId = useId()
  const id = providedId || `check-${generatedId}`

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[rgb(var(--color-accent))]"
        {...rest}
      />
      <label htmlFor={id} className="cursor-pointer text-fluid-sm leading-snug text-muted">
        {label}
      </label>
    </div>
  )
})
