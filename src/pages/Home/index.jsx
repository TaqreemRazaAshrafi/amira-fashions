import { ROUTES } from '../../constants/routes'
import { SITE } from '../../constants/site'
import Seo, { structuredData } from '../../components/common/Seo'
import Hero from '../../components/home/Hero'
import BrandPromise from '../../components/home/BrandPromise'
import CategoryGrid from '../../components/home/CategoryGrid'
import ProductSection from '../../components/home/ProductSection'
import PromoBanner from '../../components/home/PromoBanner'
import CollectionsShowcase from '../../components/home/CollectionsShowcase'
import InstagramSection from '../../components/home/InstagramSection'
import Testimonials from '../../components/home/Testimonials'

/**
 * Home.
 *
 * Sequenced as an editorial: hero, reassurance, discovery, a promotional
 * breath, the edits, social proof, Instagram. Each product rail fetches
 * independently so one slow response never holds up the page.
 */
export default function HomePage() {
  return (
    <>
      <Seo
        title={null}
        description={SITE.description}
        jsonLd={structuredData.organization()}
        canonicalPath={ROUTES.home}
      />

      <Hero />
      <BrandPromise />

      <ProductSection
        eyebrow="Just landed"
        title="New Arrivals"
        description="The latest pieces to leave the studio, released in small numbers every Friday."
        collectionSlug="new-arrivals"
        action={{ label: 'View the edit', to: ROUTES.collection('new-arrivals') }}
      />

      <CategoryGrid />

      <PromoBanner />

      <ProductSection
        eyebrow="Loved on repeat"
        title="Best Sellers"
        description="The styles our community keeps coming back for — restocked by request."
        collectionSlug="best-sellers"
        action={{ label: 'Shop best sellers', to: ROUTES.collection('best-sellers') }}
      />

      <CollectionsShowcase />

      <ProductSection
        className="bg-surface-alt"
        eyebrow="Atelier line"
        title="Premium Collection"
        description="Heavier fabrics, hand-finished detail, and construction that takes twice as long."
        collectionSlug="premium-collection"
        action={{ label: 'Explore premium', to: ROUTES.collection('premium-collection') }}
      />

      <Testimonials />
      <InstagramSection />
    </>
  )
}
