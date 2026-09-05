/**
 * Customer reviews.
 *
 * Reviews are derived from each product's own rating and review count rather
 * than authored one by one, so the star average shown on a card, the breakdown
 * bar on the PDP and the individual reviews below it can never contradict each
 * other. The derivation is seeded by the product slug, which keeps a given
 * product's reviews identical across renders, reloads and pagination.
 *
 * Replace `reviewsFor` with `GET /products/:slug/reviews` and nothing upstream
 * changes — the shape below is the contract.
 */

const AUTHORS = [
  'Ananya R.', 'Ishaan M.', 'Priya K.', 'Rahul D.', 'Meera S.', 'Kabir N.',
  'Divya P.', 'Arjun V.', 'Neha T.', 'Vikram J.', 'Sana Q.', 'Aditya B.',
  'Tara L.', 'Rohan G.', 'Zoya H.', 'Nikhil C.',
]

const TITLES = {
  5: ['Exactly as pictured', 'Worth every rupee', 'My new favourite', 'Faultless'],
  4: ['Very good, minor notes', 'Happy with this', 'Great quality', 'Would buy again'],
  3: ['Good, but sizing is odd', 'Decent for the price', 'Mixed feelings'],
  2: ['Not quite right', 'Expected more'],
}

const BODIES = {
  5: [
    'The fabric is heavier than I expected in the best way — it holds its shape all day and the finishing inside is as neat as the outside.',
    'Ordered my usual size and it fit straight out of the box. The colour is true to the photographs, which is rare.',
    'Third piece I have bought from Amira and the construction is consistently better than things at twice the price.',
    'Wore it to a wedding and was asked about it four times. It photographs beautifully.',
  ],
  4: [
    'Really well made and the colour is accurate. Took off a star only because it needed a light press out of the packaging.',
    'Comfortable and well cut. I would size up if you prefer a looser drape — it runs close to the body.',
    'Excellent quality for the price. Delivery was quicker than the estimate.',
    'Lovely piece. The only thing I would change is a slightly longer hem.',
  ],
  3: [
    'The quality is genuinely good but the sizing chart did not match my measurements — I had to exchange for the next size.',
    'Nice fabric, though the colour reads a shade darker in person than on screen.',
    'It is fine. Not a bad buy, but not the standout I hoped for from the photos.',
  ],
  2: [
    'The fit was not for me — very boxy through the shoulders. The return process was straightforward at least.',
    'Fabric felt thinner than described. Returned it.',
  ],
}

const SIZE_NOTES = ['Fits true to size', 'Runs slightly small', 'Runs slightly large']

/** Deterministic pseudo-random generator seeded from a string. */
function seededRandom(seed) {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return () => {
    hash += 0x6d2b79f5
    let t = hash
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (list, random) => list[Math.floor(random() * list.length)]

/**
 * The star breakdown for a product.
 *
 * Two invariants have to hold or the panel contradicts itself: the buckets must
 * sum to `reviewCount`, and their weighted mean must equal the displayed
 * `rating`. A plausible shape is built first, then reviews are shifted one
 * bucket at a time until the mean lands exactly — each shift moves the star
 * total by exactly one, so this always converges.
 */
function starDistribution(rating, count) {
  if (count === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  const weights = {
    5: Math.max(0, rating - 3.2) ** 2.2,
    4: Math.max(0, 5.2 - Math.abs(rating - 4.3) * 3),
    3: Math.max(0, 3 - Math.abs(rating - 3.6) * 2.4),
    2: Math.max(0, 1.4 - Math.abs(rating - 2.8) * 1.2),
    1: Math.max(0, 0.8 - Math.abs(rating - 2.2)),
  }
  const weightTotal = Object.values(weights).reduce((sum, w) => sum + w, 0) || 1

  const distribution = {}
  let assigned = 0
  for (const star of [1, 2, 3, 4]) {
    distribution[star] = Math.round((weights[star] / weightTotal) * count)
    assigned += distribution[star]
  }
  // The top bucket absorbs the rounding so the buckets always sum to `count`.
  distribution[5] = Math.max(0, count - assigned)

  const starTotal = (dist) => [1, 2, 3, 4, 5].reduce((sum, s) => sum + s * dist[s], 0)
  const target = Math.round(rating * count)

  // Promote from the lowest occupied bucket (or demote from the highest) until
  // the mean matches. Bounded so a pathological input cannot spin forever.
  let total = starTotal(distribution)
  let guard = count * 5 + 10
  while (total !== target && guard > 0) {
    guard -= 1
    if (total < target) {
      const from = [1, 2, 3, 4].find((star) => distribution[star] > 0)
      if (from === undefined) break
      distribution[from] -= 1
      distribution[from + 1] += 1
      total += 1
    } else {
      const from = [5, 4, 3, 2].find((star) => distribution[star] > 0)
      if (from === undefined) break
      distribution[from] -= 1
      distribution[from - 1] += 1
      total -= 1
    }
  }

  return distribution
}

/** Up to 8 written reviews for a product, newest first. */
export function reviewsFor(product) {
  if (!product?.reviewCount) return []
  const random = seededRandom(product.slug)
  const distribution = starDistribution(product.rating, product.reviewCount)

  // Sample stars proportionally to the real distribution, capped at 8 entries.
  const pool = []
  for (const star of [5, 4, 3, 2]) {
    const share = Math.round((distribution[star] / product.reviewCount) * 8)
    for (let i = 0; i < share; i += 1) pool.push(star)
  }
  while (pool.length < Math.min(4, product.reviewCount)) pool.push(5)
  const stars = pool.slice(0, 8)

  const released = new Date(product.releasedAt).getTime()
  /**
   * Reviews are spread between the release date and today, but "today" is
   * quantised to midnight: reading the wall clock directly would give every
   * render a slightly different span, so review dates — and the order they sort
   * into — would drift on each paint. Quantising keeps them stable for the whole
   * session while never dating a review into the future.
   */
  const midnight = new Date()
  midnight.setHours(0, 0, 0, 0)
  const span = Math.max(midnight.getTime() - released, 7 * 864e5)

  return stars
    .map((star, index) => ({
      id: `${product.id}-rv-${index + 1}`,
      author: pick(AUTHORS, random),
      rating: star,
      title: pick(TITLES[star] ?? TITLES[4], random),
      body: pick(BODIES[star] ?? BODIES[4], random),
      size: pick(product.sizes, random),
      sizeNote: pick(SIZE_NOTES, random),
      verified: random() > 0.18,
      helpfulCount: Math.floor(random() * 34),
      createdAt: new Date(released + random() * span).toISOString(),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/** Average, total and per-star breakdown — what the summary panel renders. */
export function reviewSummaryFor(product) {
  const distribution = starDistribution(product.rating, product.reviewCount)
  return {
    average: product.rating,
    total: product.reviewCount,
    distribution,
    recommendPercent: Math.round(Math.min(99, (product.rating / 5) * 100)),
  }
}
