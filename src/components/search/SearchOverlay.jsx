import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search as SearchIcon, X } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { QUERY_KEYS } from '../../constants/filters'
import { useDebounce } from '../../hooks/useDebounce'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useEscapeKey } from '../../hooks/useEscapeKey'
import { useUIStore } from '../../store/uiStore'
import { useSearchStore } from '../../store/searchStore'
import productService from '../../services/productService'
import { overlayFade, searchPanel } from '../animations/variants'
import { SearchResults, SearchSuggestions } from './SearchSuggestions'

const MIN_QUERY_LENGTH = 2

/**
 * Full-width search overlay.
 *
 * Results come through the product service on a 250 ms debounce, guarded
 * against out-of-order responses. Fully keyboard operable: Escape closes,
 * Enter runs the full search, and focus is trapped while it is open.
 */
export function SearchOverlay() {
  const isOpen = useUIStore((state) => state.isSearchOpen)
  const close = useUIStore((state) => state.closeSearch)
  const { recent, addRecent, removeRecent, clearRecent } = useSearchStore()

  const navigate = useNavigate()
  const panelRef = useRef(null)
  const requestId = useRef(0)

  const [term, setTerm] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const debouncedTerm = useDebounce(term.trim(), 250)

  useFocusTrap(panelRef, isOpen)
  useLockBodyScroll(isOpen)
  useEscapeKey(isOpen, close)

  // Reset on close so the overlay never reopens showing stale results.
  useEffect(() => {
    if (!isOpen) {
      setTerm('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || debouncedTerm.length < MIN_QUERY_LENGTH) {
      setResults([])
      setIsSearching(false)
      return
    }
    const id = ++requestId.current
    setIsSearching(true)
    productService
      .search(debouncedTerm, 6)
      .then((items) => {
        if (id === requestId.current) setResults(items)
      })
      .catch(() => {
        if (id === requestId.current) setResults([])
      })
      .finally(() => {
        if (id === requestId.current) setIsSearching(false)
      })
  }, [debouncedTerm, isOpen])

  const submit = (value) => {
    const query = (value ?? term).trim()
    if (!query) return
    addRecent(query)
    close()
    navigate(`${ROUTES.search}?${QUERY_KEYS.q}=${encodeURIComponent(query)}`)
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90]">
          <motion.button
            type="button"
            aria-label="Close search"
            onClick={close}
            variants={overlayFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 h-full w-full cursor-default bg-text/40 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            variants={searchPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative max-h-[88vh] overflow-y-auto bg-background shadow-lift"
          >
            <div className="shell py-6 sm:py-8">
              <form
                role="search"
                onSubmit={(event) => {
                  event.preventDefault()
                  submit()
                }}
                className="flex items-center gap-4 border-b border-line pb-4"
              >
                <SearchIcon
                  className="h-5 w-5 shrink-0 text-muted"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
                <input
                  data-autofocus
                  type="search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Search dresses, co-ords, ethnic wear…"
                  aria-label="Search products"
                  className="w-full bg-transparent font-display text-fluid-xl placeholder:text-muted/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close search"
                  className="shrink-0 p-2 text-muted transition-colors hover:text-text"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>

              <div className="pt-6">
                {debouncedTerm.length < MIN_QUERY_LENGTH ? (
                  <SearchSuggestions
                    recent={recent}
                    onSelect={submit}
                    onRemoveRecent={removeRecent}
                    onClearRecent={clearRecent}
                  />
                ) : (
                  <SearchResults
                    term={debouncedTerm}
                    results={results}
                    isSearching={isSearching}
                    onNavigate={close}
                    onSeeAll={() => submit(debouncedTerm)}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default SearchOverlay
