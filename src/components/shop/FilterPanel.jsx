import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'
import {
  AVAILABILITY,
  COLORS,
  DISCOUNT_OPTIONS,
  PRICE_BOUNDS,
  QUERY_KEYS,
  RATING_OPTIONS,
  SIZE_GROUPS,
} from '../../constants/filters'
import { categories } from '../../data/categories'
import { collections } from '../../data/collections'
import { departments } from '../../data/departments'
import { formatPrice, titleCase } from '../../utils/format'

const PRICE_PRESETS = [
  { label: 'Under ₹2,000', min: null, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: null },
]

/** Collapsible group. Open by default — filters that are hidden go unused. */
function FilterSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <section className="border-b border-line py-5">
      <h3>
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <span className="text-fluid-xs uppercase tracking-luxe">{title}</span>
          {isOpen ? (
            <Minus className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          ) : (
            <Plus className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          )}
        </button>
      </h3>
      {isOpen && <div className="pt-5">{children}</div>}
    </section>
  )
}

function CheckRow({ label, checked, onChange, count }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-fluid-sm text-muted transition-colors duration-250 hover:text-text">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 cursor-pointer accent-[rgb(var(--color-accent))]"
      />
      <span className={cn('flex-1', checked && 'text-text')}>{label}</span>
      {count != null && <span className="text-fluid-xs text-muted/70">{count}</span>}
    </label>
  )
}

/**
 * The complete filter surface.
 *
 * Stateless: every control writes through `update`/`toggleValue` from
 * `useShopFilters`, which owns the URL. Rendered inline in the desktop sidebar
 * and inside the mobile drawer — same component, one behaviour.
 *
 * What it offers is driven by `facets` from the catalogue response, not by the
 * global constants: a listing of dresses shows no shoe sizes, and a brand with
 * nothing in stock here is never presented as a dead end. Until facets arrive
 * the panel falls back to the full vocabulary so it is never empty on first paint.
 */
export function FilterPanel({
  filters,
  update,
  toggleValue,
  facets,
  lockedDepartment,
  lockedCategory,
  lockedCollection,
  className,
}) {
  /** A facet value is offered when the scope contains at least one match. */
  const has = (group, value) => !facets || (facets[group]?.[value] ?? 0) > 0
  const countOf = (group, value) => facets?.[group]?.[value]

  const sizeGroups = SIZE_GROUPS.map((group) => ({
    ...group,
    values: group.values.filter((size) => has('sizes', size)),
  })).filter((group) => group.values.length > 0)

  const availableColors = COLORS.filter((color) => has('colors', color.value))
  const availableBrands = Object.keys(facets?.brands ?? {}).sort()

  const scopedCategories = categories.filter(
    (category) =>
      (!lockedDepartment || category.department === lockedDepartment) &&
      has('categories', category.slug)
  )
  const priceRange = facets?.priceRange

  return (
    <div className={cn('flex flex-col', className)}>
      {!lockedDepartment && (
        <FilterSection title="Department">
          <div className="flex flex-col">
            {departments.map((department) => (
              <CheckRow
                key={department.slug}
                label={department.name}
                checked={filters.department === department.slug}
                onChange={() =>
                  update({
                    [QUERY_KEYS.department]:
                      filters.department === department.slug ? null : department.slug,
                    // A category from the old department would contradict the new one.
                    [QUERY_KEYS.category]: null,
                  })
                }
              />
            ))}
          </div>
        </FilterSection>
      )}

      {!lockedCategory && scopedCategories.length > 1 && (
        <FilterSection title="Category">
          <div className="flex max-h-72 flex-col overflow-y-auto pr-1">
            {scopedCategories.map((category) => (
              <CheckRow
                key={category.id}
                label={category.name}
                count={countOf('categories', category.slug)}
                checked={filters.category === category.slug}
                onChange={() =>
                  update({
                    [QUERY_KEYS.category]:
                      filters.category === category.slug ? null : category.slug,
                  })
                }
              />
            ))}
          </div>
        </FilterSection>
      )}

      {availableBrands.length > 1 && (
        <FilterSection title="Brand">
          <div className="flex flex-col">
            {availableBrands.map((brand) => (
              <CheckRow
                key={brand}
                label={brand}
                count={countOf('brands', brand)}
                checked={filters.brands.includes(brand)}
                onChange={() => toggleValue(QUERY_KEYS.brand, brand)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {sizeGroups.length > 0 && (
        <FilterSection title="Size">
          <div className="flex flex-col gap-5">
            {sizeGroups.map((group) => (
              <div key={group.id}>
                {sizeGroups.length > 1 && (
                  <p className="mb-2.5 text-fluid-xs text-muted">{group.label}</p>
                )}
                <div className="flex flex-wrap gap-2" role="group" aria-label={group.label}>
                  {group.values.map((size) => {
                    const isActive = filters.sizes.includes(size)
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleValue(QUERY_KEYS.size, size)}
                        aria-pressed={isActive}
                        className={cn(
                          'min-w-11 border px-3 py-2 text-fluid-xs uppercase tracking-wide transition-colors duration-250',
                          isActive
                            ? 'border-text bg-text text-background'
                            : 'border-line text-text hover:border-text'
                        )}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </FilterSection>
      )}

      {availableColors.length > 0 && (
        <FilterSection title="Colour">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
            {availableColors.map((color) => {
              const isActive = filters.colors.includes(color.value)
              return (
                <li key={color.value}>
                  <button
                    type="button"
                    onClick={() => toggleValue(QUERY_KEYS.color, color.value)}
                    aria-pressed={isActive}
                    className="flex w-full items-center gap-2.5 py-1.5 text-left text-fluid-sm transition-colors duration-250 hover:text-text"
                  >
                    <span
                      aria-hidden="true"
                      style={{ backgroundColor: color.hex }}
                      className={cn(
                        'h-4 w-4 shrink-0 rounded-full border transition-shadow duration-250',
                        isActive ? 'border-text ring-1 ring-text ring-offset-2' : 'border-line'
                      )}
                    />
                    <span className={isActive ? 'text-text' : 'text-muted'}>{color.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </FilterSection>
      )}

      <FilterSection title="Price">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {PRICE_PRESETS.map((preset) => {
              const isActive = filters.min === preset.min && filters.max === preset.max
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() =>
                    update({
                      [QUERY_KEYS.min]: isActive ? null : preset.min,
                      [QUERY_KEYS.max]: isActive ? null : preset.max,
                    })
                  }
                  aria-pressed={isActive}
                  className={cn(
                    'border px-3 py-1.5 text-fluid-xs transition-colors duration-250',
                    isActive
                      ? 'border-text bg-text text-background'
                      : 'border-line text-muted hover:border-text hover:text-text'
                  )}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>

          <div className="flex items-end gap-3">
            <label className="flex-1 text-fluid-xs text-muted">
              Min
              <input
                type="number"
                inputMode="numeric"
                min={PRICE_BOUNDS.min}
                max={PRICE_BOUNDS.max}
                step={PRICE_BOUNDS.step}
                value={filters.min ?? ''}
                placeholder={String(PRICE_BOUNDS.min)}
                onChange={(event) =>
                  update({ [QUERY_KEYS.min]: event.target.value === '' ? null : event.target.value })
                }
                className="mt-1 w-full border-b border-line bg-transparent py-2 text-fluid-sm text-text focus:border-accent focus:outline-none"
              />
            </label>
            <span aria-hidden="true" className="pb-3 text-muted">
              —
            </span>
            <label className="flex-1 text-fluid-xs text-muted">
              Max
              <input
                type="number"
                inputMode="numeric"
                min={PRICE_BOUNDS.min}
                max={PRICE_BOUNDS.max}
                step={PRICE_BOUNDS.step}
                value={filters.max ?? ''}
                placeholder={String(PRICE_BOUNDS.max)}
                onChange={(event) =>
                  update({ [QUERY_KEYS.max]: event.target.value === '' ? null : event.target.value })
                }
                className="mt-1 w-full border-b border-line bg-transparent py-2 text-fluid-sm text-text focus:border-accent focus:outline-none"
              />
            </label>
          </div>

          {priceRange?.max > 0 && (
            <p className="text-fluid-xs text-muted">
              This selection ranges from {formatPrice(priceRange.min)} to{' '}
              {formatPrice(priceRange.max)}.
            </p>
          )}
        </div>
      </FilterSection>

      <FilterSection title="Discount" defaultOpen={false}>
        <div className="flex flex-col">
          {DISCOUNT_OPTIONS.map((option) => (
            <CheckRow
              key={option.value}
              label={option.label}
              checked={String(filters.discount ?? '') === option.value}
              onChange={() =>
                update({
                  [QUERY_KEYS.discount]:
                    String(filters.discount ?? '') === option.value ? null : option.value,
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating" defaultOpen={false}>
        <div className="flex flex-col">
          {RATING_OPTIONS.map((option) => (
            <CheckRow
              key={option.value}
              label={option.label}
              checked={String(filters.rating ?? '') === option.value}
              onChange={() =>
                update({
                  [QUERY_KEYS.rating]:
                    String(filters.rating ?? '') === option.value ? null : option.value,
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      {!lockedCollection && (
        <FilterSection title="Collection" defaultOpen={false}>
          <div className="flex flex-col">
            {collections
              .filter((collection) => has('collections', collection.slug))
              .map((collection) => (
                <CheckRow
                  key={collection.slug}
                  label={collection.name}
                  count={countOf('collections', collection.slug)}
                  checked={filters.collection === collection.slug}
                  onChange={() =>
                    update({
                      [QUERY_KEYS.collection]:
                        filters.collection === collection.slug ? null : collection.slug,
                    })
                  }
                />
              ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Availability">
        <div className="flex flex-col">
          {AVAILABILITY.map((option) => (
            <CheckRow
              key={option.value}
              label={option.label}
              checked={filters.availability === option.value}
              onChange={() =>
                update({
                  [QUERY_KEYS.availability]:
                    filters.availability === option.value ? null : option.value,
                })
              }
            />
          ))}
          <CheckRow
            label="On sale only"
            count={facets?.saleCount}
            checked={filters.sale}
            onChange={() => update({ [QUERY_KEYS.sale]: filters.sale ? null : 'true' })}
          />
        </div>
      </FilterSection>

      {lockedCategory && (
        <p className="pt-5 text-fluid-xs text-muted">
          Browsing {titleCase(lockedCategory)}. Use the category rail above to change section.
        </p>
      )}
    </div>
  )
}

export default FilterPanel
