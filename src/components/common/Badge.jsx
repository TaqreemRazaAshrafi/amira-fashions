import { cn } from '../../utils/cn'

const TONES = {
  default: 'bg-text text-background',
  light: 'bg-background/90 text-text backdrop-blur-sm',
  accent: 'bg-accent text-background',
  sale: 'bg-danger text-background',
  outline: 'border border-text/25 text-text',
  muted: 'bg-surface-alt text-muted',
}

/** Small status pill. Text carries the meaning, colour only reinforces it. */
export function Badge({ children, tone = 'default', className, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-[10px] uppercase leading-none tracking-luxe',
        TONES[tone] ?? TONES.default,
        className
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

export default Badge
