import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { COLOR_MAP, QUERY_KEYS } from '../constants/filters'
import { titleCase } from '../utils/format'

/** Params that hold a comma-separated list rather than a single value. */
const LIST_KEYS = new Set([QUERY_KEYS.size, QUERY_KEYS.color, QUERY_KEYS.brand])

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
 *   /men/shirts?size=M,L&brand=Studio%20A&sort=price-low
 *
 * `locked*` values come from the route itself (department, category, collection)
 * and are removed from both the filter panel and the removable chips, so the URL
 * and the UI can never disagree.
 */
export function useShopFilters({ lockedDepartment, lockedCategory, lockedCollection } = {}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(
    () => ({
      department: lockedDepartment ?? searchParams.get(QUERY_KEYS.department) ?? null,
      category: lockedCategory ?? searchParams.get(QUERY_KEYS.category) ?? null,
      collection: lockedCollection ?? searchParams.get(QUERY_KEYS.collection) ?? null,
      brands: parseList(searchParams.get(QUERY_KEYS.brand)),
      sizes: parseList(searchParams.get(QUERY_KEYS.size)),
      colors: parseList(searchParams.get(QUERY_KEYS.color)),
      min: parseNumber(searchParams.get(QUERY_KEYS.min)),
      max: parseNumber(searchParams.get(QUERY_KEYS.max)),
      discount: parseNumber(searchParams.get(QUERY_KEYS.discount)),
      rating: parseNumber(searchParams.get(QUERY_KEYS.rating)),
      sale: searchParams.get(QUERY_KEYS.sale) === 'true',
      availability: searchParams.get(QUERY_KEYS.availability) ?? null,
      q: searchParams.get(QUERY_KEYS.q) ?? '',
    }),
    [searchParams, lockedDepartment, lockedCategory, lockedCollection]
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
    if (filters.department && !lockedDepartment)
      chips.push({
        key: QUERY_KEYS.department,
        label: titleCase(filters.department),
        value: filters.department,
      })
    if (filters.category && !lockedCategory)
      chips.push({
        key: QUERY_KEYS.category,
        label: titleCase(filters.category),
        value: filters.category,
      })
    if (filters.collection && !lockedCollection)
      chips.push({
        key: QUERY_KEYS.collection,
        label: titleCase(filters.collection),
        value: filters.collection,
      })
    filters.brands.forEach((brand) =>
      chips.push({ key: QUERY_KEYS.brand, label: brand, value: brand, isList: true })
    )
    filters.sizes.forEach((size) =>
      chips.push({ key: QUERY_KEYS.size, label: `Size ${size}`, value: size, isList: true })
    )
    filters.colors.forEach((color) =>
      chips.push({
        key: QUERY_KEYS.color,
        label: COLOR_MAP[color]?.label ?? titleCase(color),
        value: color,
        isList: true,
      })
    )
    if (filters.min != null || filters.max != null)
      chips.push({
        key: 'price',
        label: `₹${filters.min ?? 0} – ₹${filters.max ?? '∞'}`,
        value: 'price',
      })
    if (filters.discount != null)
      chips.push({
        key: QUERY_KEYS.discount,
        label: `${filters.discount}% off or more`,
        value: filters.discount,
      })
    if (filters.rating != null)
      chips.push({
        key: QUERY_KEYS.rating,
        label: `${filters.rating}★ & above`,
        value: filters.rating,
      })
    if (filters.sale) chips.push({ key: QUERY_KEYS.sale, label: 'On sale', value: 'true' })
    if (filters.availability)
      chips.push({
        key: QUERY_KEYS.availability,
        label: titleCase(filters.availability),
        value: filters.availability,
      })
    return chips
  }, [filters, lockedDepartment, lockedCategory, lockedCollection])

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
