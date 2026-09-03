import { ROUTES } from '../../constants/routes'
import { featuredCollections } from '../../data/collections'
import CollectionCard from '../collection/CollectionCard'
import SectionHeader from '../layout/SectionHeader'
import { Stagger, StaggerItem } from '../animations/Stagger'

/**
 * The featured edits.
 *
 * One tall feature tile beside a stack of smaller ones. The grid is
 * `items-start` on purpose — stretching a tile would fight the fixed aspect
 * ratio its image relies on.
 */
export function CollectionsShowcase() {
  const [lead, ...rest] = featuredCollections

  return (
    <section className="shell section-y">
      <SectionHeader
        eyebrow="The edits"
        title="Collections"
        description="Each edit is built around one idea — a fabric, a season, a way of dressing — and closes when it sells out."
        action={{ label: 'All collections', to: ROUTES.collections }}
      />

      <Stagger stagger={0.08} className="grid items-start gap-3 sm:gap-4 lg:grid-cols-2">
        {lead && (
          <StaggerItem>
            <CollectionCard collection={lead} size="feature" priority />
          </StaggerItem>
        )}

        <div className="grid gap-3 sm:gap-4">
          {rest.map((collection) => (
            <StaggerItem key={collection.slug}>
              <CollectionCard collection={collection} />
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  )
}

export default CollectionsShowcase
