import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useEscapeKey } from '../../hooks/useEscapeKey'
import { drawerLeft, drawerRight, overlayFade } from '../animations/variants'

/**
 * Accessible slide-over panel.
 *
 * Rendered in a portal so it escapes any transformed ancestor, with a focus
 * trap, background scroll lock, Escape-to-close and a labelled dialog role.
 */
export function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  description,
  children,
  footer,
  className,
  labelledBy,
}) {
  const panelRef = useRef(null)
  const generatedId = useId()
  const titleId = labelledBy || `drawer-title-${generatedId}`

  useFocusTrap(panelRef, open)
  useLockBodyScroll(open)
  useEscapeKey(open, onClose)

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-text/40 backdrop-blur-[2px]"
            variants={overlayFade}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            variants={side === 'left' ? drawerLeft : drawerRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'absolute inset-y-0 flex w-full max-w-[440px] flex-col bg-background shadow-lift',
              side === 'left' ? 'left-0' : 'right-0',
              className
            )}
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <h2 id={titleId} className="font-sans text-fluid-xs uppercase tracking-luxe">
                  {title}
                </h2>
                {description && <p className="mt-1 text-fluid-xs text-muted">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 -mt-1 p-2 text-muted transition-colors duration-250 hover:text-text"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>

            {footer && <div className="border-t border-line bg-surface px-6 py-5">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Drawer
