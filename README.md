# Amira Fashions

A production-ready storefront for **Amira Fashions** — an Instagram-native Indian fashion label
([@amira\_\_fashions](https://instagram.com/amira__fashions)). Editorial layout, motion that stays
quiet, and a data layer built so the mock catalogue can be swapped for a real backend without
touching the UI.

React 19 · Vite · Tailwind CSS · Framer Motion · Zustand · React Hook Form + Zod · Axios

## Getting started

```bash
npm install
cp .env.example .env    # optional — the app boots with safe defaults
npm run dev             # http://localhost:5173
```

| Script            | What it does                                |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                    |
| `npm run build`   | Production build to `dist/`                 |
| `npm run preview` | Serve the production build locally          |
| `npm run lint`    | Oxlint across `src/`                        |

## Architecture

```text
src/
├── api/          axios instance, endpoint map, mock transport
├── services/     the only place that talks to the API — components call these
├── store/        Zustand slices (cart, wishlist, auth, search, UI)
├── hooks/        reusable behaviour (async, filters, focus trap, media queries…)
├── data/         mock catalogue and editorial copy
├── constants/    routes, filter vocabularies, brand/site config
├── utils/        pure helpers (formatting, image URLs, query, storage)
├── components/
│   ├── common/       design-system primitives (Button, Image, Modal, Seo…)
│   ├── layout/       app shell, page header, section header
│   ├── navbar/ footer/ search/ cart/ checkout/ product/ collection/ shop/ home/
│   └── animations/   shared variants, reveals, page transition, custom cursor
├── pages/        one folder per route
└── routes/       the lazily-loaded route table
```

Rules the codebase holds to:

- **Components never import `data/` or `axios` directly.** They call a service; the service decides
  whether the answer comes from the mock dataset or the server.
- **Design tokens only.** Colours, type scale, spacing and easing live in `styles/globals.css` and
  `tailwind.config.js`. No hex values in components.
- **URL is the source of truth for discovery state.** `useShopFilters` reads and writes the query
  string, so every filtered view is shareable and back/forward behaves.
- **Motion degrades.** Every animated component checks `prefers-reduced-motion` and renders static
  markup rather than animating faster.

## Connecting a real backend

1. Point `VITE_API_BASE_URL` at your API and set `VITE_USE_MOCK_API=false`.
2. Match the endpoint paths in [`src/api/endpoints.js`](src/api/endpoints.js) — or edit them.
3. Return the product shape produced by `normalize()` in [`src/data/products.js`](src/data/products.js).

Nothing in `components/` or `pages/` changes. `src/api/mockAdapter.js` and the `USE_MOCK` guards in
each service can then be deleted.

## Payments

`services/paymentService.js` is deliberately gateway-agnostic: the client asks the server to create
an intent, opens the hosted checkout, and hands the signature back for the **server** to verify and
capture. Only the publishable key (`VITE_RAZORPAY_KEY_ID`) is ever read in the browser — anything
prefixed `VITE_` is inlined into the bundle and served to every visitor, so secret keys must stay on
the server.

## Environment variables

| Variable                 | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| `VITE_API_BASE_URL`      | REST API root                                       |
| `VITE_USE_MOCK_API`      | `true` (default) serves the local mock catalogue     |
| `VITE_SITE_URL`          | Canonical origin used for SEO tags                   |
| `VITE_INSTAGRAM_HANDLE`  | Instagram handle used across the site                |
| `VITE_WHATSAPP_NUMBER`   | WhatsApp contact (digits, with country code)         |
| `VITE_CONTACT_EMAIL`     | Studio email                                         |
| `VITE_RAZORPAY_KEY_ID`   | **Publishable** gateway key only                     |

## Accessibility & SEO

Semantic landmarks and heading order, a skip link, focus-visible rings, focus-trapped dialogs that
close on Escape, `aria-live` for cart/search/result counts, and state never signalled by colour
alone. Every page sets title, description, canonical, Open Graph and Twitter tags via
`components/common/Seo`, with JSON-LD for Organization, Product, BreadcrumbList and FAQPage.

## Images

Product imagery is served from a transform-capable CDN through `utils/images.js`, which requests
per-breakpoint widths and negotiates AVIF/WebP. `components/common/Image` adds the intrinsic aspect
box, blurred placeholder, lazy loading and a branded fallback. Swapping CDNs means editing one file.
