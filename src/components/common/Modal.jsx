import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useEscapeKey } from '../../hooks/useEscapeKey'
import { overlayFade } from '../animations/variants'

const panel = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 12, scale: 0.99, transition: { duration: 0.22 } },
}

/** Centred dialog, sharing the Drawer's accessibility contract. */
export function Modal({ open, onClose, title, children, className, size = 'lg' }) {
  const ref = useRef(null)
  const titleId = `modal-${useId()}`

  useFocusTrap(ref, open)
  useLockBodyScroll(open)
  useEscapeKey(open, onClose)

  if (typeof document === 'undefined') return null

  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-text/45 backdrop-blur-[3px]"
            variants={overlayFade}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative max-h-[92vh] w-full overflow-y-auto bg-background shadow-lift',
              widths[size] ?? widths.lg,
              className
            )}
          >
            <h2 id={titleId} className="sr-only">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 bg-background/80 p-2 text-muted backdrop-blur transition-colors duration-250 hover:text-text"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Modal
