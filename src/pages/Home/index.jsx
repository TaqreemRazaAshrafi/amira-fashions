import { ROUTES } from '../../constants/routes'
import { SITE } from '../../constants/site'
import { QUERY_KEYS } from '../../constants/filters'
import Seo, { structuredData } from '../../components/common/Seo'
import Hero from '../../components/home/Hero'
import BrandPromise from '../../components/home/BrandPromise'
import CategoryGrid from '../../components/home/CategoryGrid'
import DepartmentShowcase from '../../components/home/DepartmentShowcase'
import ProductSection from '../../components/home/ProductSection'
import PromoBanner from '../../components/home/PromoBanner'
import CollectionsShowcase from '../../components/home/CollectionsShowcase'
import InstagramSection from '../../components/home/InstagramSection'
import Testimonials from '../../components/home/Testimonials'

/**
 * Home.
 *
 * Sequenced as an editorial: hero, reassurance, the two department doors,
 * discovery, a promotional breath, the edits, social proof, Instagram. Each
 * product rail fetches independently so one slow response never holds up the
 * page.
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

      <DepartmentShowcase />

      <CategoryGrid
        eyebrow="Shop by category"
        title="Find your silhouette"
        description="Menswear and womenswear, each cut with a different part of the week in mind."
      />

      <ProductSection
        flag="newArrival"
        eyebrow="Just landed"
        title="New Arrivals"
        description="The latest pieces to leave the studio, released in small numbers every Friday."
        action={{ label: 'View the edit', to: ROUTES.newArrivals }}
      />

      <PromoBanner />

      <ProductSection
        className="bg-surface-alt"
        trending
        eyebrow="Moving fastest"
        title="Trending Now"
        description="Ranked by what our community is actually buying and rating this month."
        action={{ label: 'Shop trending', to: `${ROUTES.shop}?${QUERY_KEYS.sort}=best-selling` }}
      />

      <ProductSection
        flag="bestseller"
        eyebrow="Loved on repeat"
        title="Best Sellers"
        description="The styles our community keeps coming back for — restocked by request."
        action={{ label: 'Shop best sellers', to: ROUTES.bestSellers }}
      />

      <CollectionsShowcase />

      <ProductSection
        className="bg-surface-alt"
        collectionSlug="premium-collection"
        eyebrow="Atelier line"
        title="Premium Collection"
        description="Heavier fabrics, hand-finished detail, and construction that takes twice as long."
        action={{ label: 'Explore premium', to: ROUTES.collection('premium-collection') }}
      />

      <Testimonials />
      <InstagramSection />
    </>
  )
}
