import { lazy } from 'react'
import { ROUTES } from '../constants/routes'

/**
 * Route table.
 *
 * Every page is code-split: the home route ships on first paint and the rest
 * arrive on navigation, which keeps the initial bundle to the shell plus one
 * page. Paths come from `constants/routes` so the router and every <Link> in
 * the app read from the same source.
 */
const HomePage = lazy(() => import('../pages/Home'))
const ShopPage = lazy(() => import('../pages/Shop'))
const ProductDetailsPage = lazy(() => import('../pages/ProductDetails'))
const CollectionsPage = lazy(() => import('../pages/Collections'))
const CollectionDetailPage = lazy(() => import('../pages/Collections/CollectionDetail'))
const AboutPage = lazy(() => import('../pages/About'))
const ContactPage = lazy(() => import('../pages/Contact'))
const CartPage = lazy(() => import('../pages/Cart'))
const CheckoutPage = lazy(() => import('../pages/Checkout'))
const WishlistPage = lazy(() => import('../pages/Wishlist'))
const SearchPage = lazy(() => import('../pages/Search'))
const LoginPage = lazy(() => import('../pages/Login'))
const AccountPage = lazy(() => import('../pages/Account'))
const NotFoundPage = lazy(() => import('../pages/NotFound'))

export const routes = [
  { path: ROUTES.home, Component: HomePage },
  { path: ROUTES.shop, Component: ShopPage },
  { path: `${ROUTES.shop}/:category`, Component: ShopPage },
  { path: '/product/:slug', Component: ProductDetailsPage },
  { path: ROUTES.collections, Component: CollectionsPage },
  { path: `${ROUTES.collections}/:slug`, Component: CollectionDetailPage },
  { path: ROUTES.about, Component: AboutPage },
  { path: ROUTES.contact, Component: ContactPage },
  { path: ROUTES.cart, Component: CartPage },
  { path: ROUTES.checkout, Component: CheckoutPage },
  { path: ROUTES.wishlist, Component: WishlistPage },
  { path: ROUTES.search, Component: SearchPage },
  { path: ROUTES.login, Component: LoginPage },
  { path: ROUTES.account, Component: AccountPage },
  { path: '*', Component: NotFoundPage },
]

export default routes
