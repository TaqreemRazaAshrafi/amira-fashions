# API contract

The storefront talks to the network only through `src/services/`. Every service
method has two branches: a real `apiClient` call, and a local branch used while
`VITE_USE_MOCK_API` is `true`. Setting it to `false` switches the whole app onto
a live backend with no component changes — provided the server returns the
shapes below.

Paths are declared once in [`src/api/endpoints.js`](src/api/endpoints.js) and are
relative to `VITE_API_BASE_URL`.

## Conventions

- **Auth**: a bearer token is attached from the persisted session by the request
  interceptor in [`src/api/client.js`](src/api/client.js).
- **Errors**: any non-2xx is normalised to `ApiError { message, status, code, details }`.
  A `401` clears the stored session so the UI cannot loop on a dead token.
  `message` is shown to the shopper, so return something they can act on.
- **Money**: integer paise-free rupees (e.g. `4290` means ₹4,290). No decimals.
- **Server is authoritative** for prices, discounts, stock and order totals. The
  client recomputes totals only to render them; it never sends an amount to be
  trusted.

---

## Implemented and exercised by the UI

### `GET /products`
Query: `page`, `perPage`, `sort`, `department`, `category`, `collection`,
`brand` (csv), `size` (csv), `color` (csv), `min`, `max`, `discount`, `rating`,
`sale`, `availability`, `q`.

```jsonc
{
  "items": [Product],
  "page": 1, "perPage": 12, "total": 105, "totalPages": 9, "hasMore": true,
  "facets": {
    "sizes":       { "M": 12, "L": 9 },      // value → count, within this scope
    "colors":      { "black": 7 },
    "brands":      { "Studio A": 4 },
    "categories":  { "shirts": 4 },
    "collections": { "best-sellers": 6 },
    "priceRange":  { "min": 1290, "max": 21500 },
    "saleCount": 18, "inStockCount": 102
  }
}
```

`facets` drives the filter panel: it only offers values that can return
something. Counts are computed within the department/category scope but *before*
the shopper's own refinements, so selecting one size does not zero every other.
If `facets` is omitted the panel falls back to the full static vocabulary.

**Sort keys**: `featured`, `newest`, `price-low`, `price-high`, `rating`,
`best-selling`, `name-asc`.

### `Product`

```jsonc
{
  "id": "amira-m005", "sku": "AF-MSH-005", "slug": "harlan-white-oxford-shirt",
  "name": "Harlan White Oxford Shirt", "brand": "Amira",
  "department": "men",                  // must match a department slug
  "category": "shirts",                 // must exist within that department
  "description": "…", "material": "…",
  "price": 3290, "compareAtPrice": null,
  "onSale": false, "discountPercent": 0,
  "images": ["https://…"],  "video": null,
  "collections": ["best-sellers"],      // "sale" is expected when onSale
  "sizes": ["S","M","L","XL","XXL"], "colors": ["ivory","sapphire"],
  "stock": 45, "inStock": true, "lowStock": false,
  "featured": true, "bestseller": true, "newArrival": false,
  "rating": 4.8, "reviewCount": 198, "unitsSold": 1420,
  "releasedAt": "2026-04-02",
  "fit": "Trim, not tight", "sizeAndFit": "…",
  "specifications": [{ "label": "Collar", "value": "Button-down" }] | null,
  "care": ["…"], "shipping": "…", "returns": "…"
}
```

`unitsSold` backs the "Best selling" sort. `inStock`, `lowStock`, `onSale` and
`discountPercent` are derived server-side so every client agrees on them.

### `GET /products/:slug` → `Product`
`404` for an unknown slug; the PDP renders its not-found page on that status.

### `GET /products/:slug/related?limit=8` → `Product[]`
Should not cross departments.

### `GET /products/:slug/reviews`

```jsonc
{
  "items": [{
    "id": "…", "author": "Ananya R.", "rating": 5, "title": "…", "body": "…",
    "size": "M", "sizeNote": "Fits true to size",
    "verified": true, "helpfulCount": 12, "createdAt": "2026-08-17T…"
  }],
  "summary": {
    "average": 4.8, "total": 112,
    "distribution": { "5": 84, "4": 22, "3": 6, "2": 0, "1": 0 },
    "recommendPercent": 96
  }
}
```

The buckets must sum to `total` and their weighted mean must equal `average` at
one decimal place, or the panel contradicts itself.

### `GET /departments` · `GET /categories?department=` · `GET /brands` · `GET /collections`
`Category` requires `id`, `slug`, `name`, `department`, `group`, `description`,
`image`. `group` places the category in a mega-menu column — currently one of
`Clothing`, `Ethnic Wear`, `Footwear`, `Accessories`
(see `CATEGORY_GROUPS` in `src/data/departments.js`).

### `GET /search?q=&limit=` → `Product[]`

### `POST /auth/login` · `POST /auth/register` → `{ token, user }`
`login` takes `{ identifier, password }` where `identifier` is an email **or** a
10-digit mobile number. `register` takes `{ name, email, phone, password }`.

### `POST /auth/forgot-password` → `{ ok, channel: "email"|"sms", message }`
Must respond identically whether or not the account exists — otherwise this
endpoint becomes an account-enumeration oracle.

### `POST /auth/verify-otp` → `{ ok, resetToken }` · `POST /auth/reset-password` → `{ ok }`

### `POST /orders` → `Order`
Takes `{ items, customer, address, delivery, totals, coupon, paymentMethod, payment }`.
The server **must** recompute `totals` and reject a mismatch. Returns the order
with `id`, `status`, `placedAt`, `estimatedDelivery`.

### `POST /payments/intent` → `{ id, provider, amount, currency, status }`
### `POST /payments/verify` → `{ verified, paymentId, … }`
Signature verification and capture happen server-side. Only the *publishable*
gateway key is ever read on the client.

---

## Required before launch — currently local-only

These have service methods and endpoint paths, but nothing is persisted
server-side yet. Each is a real gap, not a mock to keep.

| Endpoint | Status | What breaks without it |
| --- | --- | --- |
| `GET /orders`, `GET /orders/:id` | **Missing.** `orderService.list/getById` fall back to orders recorded in `orderStore` on the device. | Order history is per-browser: clearing site data loses it, and a second device shows nothing. |
| `GET /orders/:id/tracking` | **Missing.** `trackingFor()` derives a plausible timeline from `placedAt`. | The timeline is an estimate, not carrier truth. |
| `GET/POST/PATCH/DELETE /account/addresses` | **Partly missing.** Calls succeed and echo their input; the book lives in `userStore`. | Saved addresses do not follow the shopper across devices. |
| `PATCH /account/profile` | **Partly missing.** Echoes the patch. | Profile edits are not durable. |
| `GET /account/payment-methods` | **Missing.** Returns `[]`; the UI stores display-only labels locally. | No saved payment shortcuts server-side. Note the client never handles card numbers — that stays with the gateway. |
| `POST /cart/coupons/:code` | **Missing.** Validated client-side against `src/data/coupons.js`. | **Security-relevant**: the codes and their rules ship in the bundle. The server must revalidate every coupon at order time and is the only authority on the discount. |
| `PUT/GET /cart` | Stubbed. The bag is local. | No cross-device cart. |
| `PUT/GET /wishlist` | Stubbed. The wishlist is local. | Wishlist does not survive a device change, and cannot merge on sign-in. |

### Guest → account merge

Cart and wishlist are kept locally for guests. When `POST /auth/login` succeeds
the client should push the local bag and wishlist and receive the merged result;
`cartService.sync` and `wishlistService.sync` are the seams for that, and are
currently no-ops.
