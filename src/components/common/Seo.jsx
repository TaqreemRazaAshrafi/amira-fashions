import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { SITE } from '../../constants/site'
import { imageUrl } from '../../utils/images'

/**
 * Per-page document head.
 *
 * Emits title, description, canonical, Open Graph and Twitter tags, plus any
 * JSON-LD passed in. Canonical URLs are built from the current pathname only —
 * query strings (filters, sort) must not fragment the canonical.
 */
export function Seo({
  title,
  description = SITE.description,
  image,
  type = 'website',
  noIndex = false,
  canonicalPath,
  jsonLd,
  children,
}) {
  const { pathname } = useLocation()
  const path = canonicalPath ?? pathname
  const canonical = `${SITE.url}${path === '/' ? '' : path}`
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`
  const ogImage = image ? imageUrl(image, 1200) : undefined

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={SITE.locale} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      {children}
    </Helmet>
  )
}

/** schema.org builders — kept beside Seo so the shapes stay in one place. */
export const structuredData = {
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    sameAs: [`https://instagram.com/${import.meta.env.VITE_INSTAGRAM_HANDLE || 'amira__fashions'}`],
  }),

  product: (product) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images.map((src) => imageUrl(src, 1200)),
    brand: { '@type': 'Brand', name: SITE.name },
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
    offers: {
      '@type': 'Offer',
      url: `${SITE.url}/product/${product.slug}`,
      priceCurrency: SITE.currency,
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }),

  breadcrumbs: (crumbs) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${SITE.url}${crumb.to}`,
    })),
  }),

  faq: (faqs) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }),
}

export default Seo
