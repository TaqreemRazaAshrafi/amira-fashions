import { photo } from '../utils/images'
import { ROUTES } from '../constants/routes'

/** Hero slides. Kept in data so marketing copy changes never touch components. */
export const heroSlides = [
  {
    id: 'hero-define',
    eyebrow: 'Autumn / Winter 2026',
    title: 'Define Your Style',
    subtitle:
      'Modern fashion for every moment — menswear and womenswear, cut in small runs and rarely repeated.',
    cta: { label: 'Shop Men', to: ROUTES.men },
    ctaSecondary: { label: 'Shop Women', to: ROUTES.women },
    image: photo('1509319117193-57bab727e09d'),
    focal: 'center 30%',
  },
  {
    id: 'hero-aurelia',
    eyebrow: 'Autumn / Winter 2026',
    title: 'Elevate Your Everyday',
    subtitle: 'Discover Aurelia — warm metallics, deep ink and the long evenings they were made for.',
    cta: { label: 'Shop Collection', to: ROUTES.collection('aurelia') },
    image: photo('1509319117193-57bab727e09d'),
    focal: 'center 30%',
  },
  {
    id: 'hero-atelier',
    eyebrow: 'The Atelier Line',
    title: 'Made to Be Kept',
    subtitle: 'Hand-finished silks and heritage weaves, produced in numbered runs of forty or fewer.',
    cta: { label: 'Explore Premium', to: ROUTES.collection('premium-collection') },
    image: photo('1538329972958-465d6d2144ed'),
    focal: 'center 25%',
  },
  {
    id: 'hero-new',
    eyebrow: 'New This Week',
    title: 'The Friday Edit',
    subtitle: 'A handful of new pieces every Friday at 8 PM IST. Small runs, rarely repeated.',
    cta: { label: 'Shop New Arrivals', to: ROUTES.collection('new-arrivals') },
    image: photo('1493655161922-ef98929de9d8'),
    focal: 'center 35%',
  },
]

/** Full-bleed promotional band between product rails. */
export const promoBanner = {
  eyebrow: 'Limited Edit',
  title: 'Forty pieces. One weave.',
  body: 'The Kashi Banarasi is woven on a pit loom in Varanasi over three weeks. When this run closes, it does not return.',
  cta: { label: 'View the piece', to: ROUTES.product('kashi-sapphire-banarasi-saree') },
  image: photo('1580489944761-15a19d654956'),
}
