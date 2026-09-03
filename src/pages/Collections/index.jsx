import { ROUTES } from '../../constants/routes'
import { collections } from '../../data/collections'
import Seo, { structuredData } from '../../components/common/Seo'
import PageHero from '../../components/layout/PageHero'
import CollectionCard from '../../components/collection/CollectionCard'
import { Stagger, StaggerItem } from '../../components/animations/Stagger'

/** Index of every edit. */
export default function CollectionsPage() {
  return (
    <>
      <Seo
        title="Collections"
        description="Every Amira Fashions edit — new arrivals, best sellers, the atelier line, Aurelia and final cuts."
        image={collections[0]?.cover}
        canonicalPath={ROUTES.collections}
        jsonLd={structuredData.breadcrumbs([
          { label: 'Home', to: ROUTES.home },
          { label: 'Collections', to: ROUTES.collections },
        ])}
      />

      <PageHero
        eyebrow="The edits"
        title="Collections"
        description="Each collection is built around one idea — a fabric, a season, a way of dressing — and released in a run we do not repeat."
        breadcrumbs={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Collections', to: ROUTES.collections },
        ]}
      />

      <div className="shell pb-section">
        <Stagger
          as="ul"
          stagger={0.08}
          className="grid items-start gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {collections.map((collection, index) => (
            <StaggerItem as="li" key={collection.slug}>
              <CollectionCard collection={collection} priority={index < 3} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </>
  )
}
