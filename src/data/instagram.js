import { photo } from '../utils/images'
import { INSTAGRAM_HANDLE } from '../constants/site'

const profileUrl = `https://instagram.com/${INSTAGRAM_HANDLE}`

/**
 * Instagram grid. In production these are hydrated from the Instagram Basic
 * Display API via `services/instagramService.js`; the shape below matches the
 * fields that endpoint returns, so only the source changes.
 */
export const instagramPosts = [
  {
    id: 'ig-1',
    type: 'image',
    image: photo('1631217868264-e5b90bb7e133'),
    caption: 'The Aurelia slip, styled down for a Tuesday.',
    likes: 2841,
    permalink: profileUrl,
  },
  {
    id: 'ig-2',
    type: 'reel',
    image: photo('1544022613-e87ca75a784a'),
    caption: 'Behind the drape — Chanderi, on the loom.',
    likes: 5120,
    views: 41200,
    permalink: profileUrl,
  },
  {
    id: 'ig-3',
    type: 'image',
    image: photo('1558769132-cb1aea458c5e'),
    caption: 'Champagne on champagne. Aurelia AW26.',
    likes: 1974,
    permalink: profileUrl,
  },
  {
    id: 'ig-4',
    type: 'reel',
    image: photo('1562572159-4efc207f5aff'),
    caption: 'Three ways to wear the Sahara co-ord.',
    likes: 6380,
    views: 88400,
    permalink: profileUrl,
  },
  {
    id: 'ig-5',
    type: 'image',
    image: photo('1564257631407-4deb1f99d992'),
    caption: 'Studio light, Bandra, 4 PM.',
    likes: 1580,
    permalink: profileUrl,
  },
  {
    id: 'ig-6',
    type: 'image',
    image: photo('1499939667766-4afceb292d05'),
    caption: 'The corset bustier, restocked by request.',
    likes: 3260,
    permalink: profileUrl,
  },
  {
    id: 'ig-7',
    type: 'reel',
    image: photo('1473966968600-fa801b869a1a'),
    caption: 'Friday drop, 8 PM IST. Set a reminder.',
    likes: 4410,
    views: 62900,
    permalink: profileUrl,
  },
  {
    id: 'ig-8',
    type: 'image',
    image: photo('1470309864661-68328b2cd0a5'),
    caption: 'Wine velvet season is officially open.',
    likes: 2205,
    permalink: profileUrl,
  },
]

export const instagramProfile = {
  handle: INSTAGRAM_HANDLE,
  url: profileUrl,
  followers: '48.2K',
  posts: instagramPosts.length,
}
