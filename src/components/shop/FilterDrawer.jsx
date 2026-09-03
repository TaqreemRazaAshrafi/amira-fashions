import { useUIStore } from '../../store/uiStore'
import { pluralize } from '../../utils/format'
import Button from '../common/Button'
import Drawer from '../common/Drawer'
import FilterPanel from './FilterPanel'

/** Mobile home for the filter panel. Desktop renders the panel inline instead. */
export function FilterDrawer({ total, activeCount, onClear, ...panelProps }) {
  const isOpen = useUIStore((state) => state.isFilterDrawerOpen)
  const close = useUIStore((state) => state.closeFilterDrawer)

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      side="left"
      title="Filter"
      description={activeCount > 0 ? `${activeCount} applied` : undefined}
      className="max-w-[min(92vw,420px)]"
      footer={
        <div className="flex items-center gap-3">
          <Button variant="quiet" size="md" fullWidth magnetic={false} onClick={onClear}>
            Clear all
          </Button>
          <Button size="md" fullWidth magnetic={false} onClick={close}>
            Show {pluralize(total, 'piece')}
          </Button>
        </div>
      }
    >
      <FilterPanel {...panelProps} className="px-6 pb-6" />
    </Drawer>
  )
}

export default FilterDrawer
