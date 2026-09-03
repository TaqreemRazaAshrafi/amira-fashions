import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, AlertCircle } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useUIStore } from '../../store/uiStore'

const ICONS = { default: Check, success: Check, error: AlertCircle }

/**
 * Toast host. Rendered once in the layout and driven by `uiStore.toast()`.
 * The region is a polite live region so announcements never interrupt.
 */
export function Toaster() {
  const toasts = useUIStore((state) => state.toasts)
  const dismiss = useUIStore((state) => state.dismissToast)

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[95] flex flex-col items-center gap-2 p-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end sm:p-0"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant] ?? ICONS.default
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 border px-4 py-3 shadow-soft',
                toast.variant === 'error'
                  ? 'border-danger/30 bg-danger/5 text-text'
                  : 'border-line bg-background text-text'
              )}
            >
              <Icon
                aria-hidden="true"
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0',
                  toast.variant === 'error' ? 'text-danger' : 'text-accent'
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-fluid-xs uppercase tracking-wide">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 truncate text-fluid-xs text-muted">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismiss(toast.id)}
                className="-mr-1 -mt-1 p-1 text-muted transition-colors hover:text-text"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default Toaster
