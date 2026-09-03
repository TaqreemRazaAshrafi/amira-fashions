import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { QUERY_KEYS } from '../constants/filters'

const LIST_KEYS = new Set([QUERY_KEYS.size, QUERY_KEYS.color])

const parseList = (value) => (value ? value.split(',').filter(Boolean) : [])
const parseNumber = (value) => {
  const n = Number(value)
  return value != null && value !== '' && !Number.isNaN(n) ? n : null
}

/**
 * Binds the shop's filter state to the URL query string.
 *
 * The URL is the single source of truth, which makes every filtered view
 * shareable, bookmarkable and correct on back/forward navigation:
 *   /shop?category=dresses&size=M,L&sort=price-low
 */
export function useShopFilters({ lockedCategory, lockedCollection } = {}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(
    () => ({
      category: lockedCategory ?? searchParams.get(QUERY_KEYS.category) ?? null,
      collection: lockedCollection ?? searchParams.get(QUERY_KEYS.collection) ?? null,
      sizes: parseList(searchParams.get(QUERY_KEYS.size)),
      colors: parseList(searchParams.get(QUERY_KEYS.color)),
      min: parseNumber(searchParams.get(QUERY_KEYS.min)),
      max: parseNumber(searchParams.get(QUERY_KEYS.max)),
      sale: searchParams.get(QUERY_KEYS.sale) === 'true',
      availability: searchParams.get(QUERY_KEYS.availability) ?? null,
      q: searchParams.get(QUERY_KEYS.q) ?? '',
    }),
    [searchParams, lockedCategory, lockedCollection]
  )

  const sort = searchParams.get(QUERY_KEYS.sort) ?? 'featured'
  const page = parseNumber(searchParams.get(QUERY_KEYS.page)) ?? 1

  /** Writes params, dropping empty values so URLs stay clean. */
  const update = useCallback(
    (patch, { resetPage = true } = {}) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          for (const [key, value] of Object.entries(patch)) {
            const isEmpty =
              value == null ||
              value === '' ||
              value === false ||
              (Array.isArray(value) && value.length === 0)
            if (isEmpty) next.delete(key)
            else next.set(key, Array.isArray(value) ? value.join(',') : String(value))
          }
          if (resetPage && !('page' in patch)) next.delete(QUERY_KEYS.page)
          return next
        },
        { replace: true, preventScrollReset: true }
      )
    },
    [setSearchParams]
  )

  /** Adds or removes one value from a multi-select filter. */
  const toggleValue = useCallback(
    (key, value) => {
      if (!LIST_KEYS.has(key)) return
      const current = parseList(searchParams.get(key))
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      update({ [key]: next })
    },
    [searchParams, update]
  )

  const clearAll = useCallback(() => {
    const next = new URLSearchParams()
    // Preserve the sort and the route-locked context.
    const currentSort = searchParams.get(QUERY_KEYS.sort)
    if (currentSort) next.set(QUERY_KEYS.sort, currentSort)
    setSearchParams(next, { replace: true, preventScrollReset: true })
  }, [searchParams, setSearchParams])

  /** Chips rendered above the grid; each knows how to remove itself. */
  const activeChips = useMemo(() => {
    const chips = []
    if (filters.category && !lockedCategory)
      chips.push({ key: QUERY_KEYS.category, label: filters.category, value: filters.category })
    if (filters.collection && !lockedCollection)
      chips.push({
        key: QUERY_KEYS.collection,
        label: filters.collection,
        value: filters.collection,
      })
    filters.sizes.forEach((s) =>
      chips.push({ key: QUERY_KEYS.size, label: `Size ${s}`, value: s, isList: true })
    )
    filters.colors.forEach((c) =>
      chips.push({ key: QUERY_KEYS.color, label: c, value: c, isList: true })
    )
    if (filters.min != null || filters.max != null)
      chips.push({
        key: 'price',
        label: `₹${filters.min ?? 0} – ₹${filters.max ?? '∞'}`,
        value: 'price',
      })
    if (filters.sale) chips.push({ key: QUERY_KEYS.sale, label: 'On sale', value: 'true' })
    if (filters.availability)
      chips.push({
        key: QUERY_KEYS.availability,
        label: filters.availability.replace('-', ' '),
        value: filters.availability,
      })
    return chips
  }, [filters, lockedCategory, lockedCollection])

  const removeChip = useCallback(
    (chip) => {
      if (chip.key === 'price') update({ [QUERY_KEYS.min]: null, [QUERY_KEYS.max]: null })
      else if (chip.isList) toggleValue(chip.key, chip.value)
      else update({ [chip.key]: null })
    },
    [update, toggleValue]
  )

  return {
    filters,
    sort,
    page,
    activeChips,
    activeCount: activeChips.length,
    update,
    toggleValue,
    removeChip,
    clearAll,
    setSort: (value) => update({ [QUERY_KEYS.sort]: value }),
    setPage: (value) => update({ [QUERY_KEYS.page]: value }, { resetPage: false }),
    setQuery: (value) => update({ [QUERY_KEYS.q]: value }),
  }
}
