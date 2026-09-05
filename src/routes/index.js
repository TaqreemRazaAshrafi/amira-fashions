import { lazy } from 'react'
import { ROUTES } from '../constants/routes'
import { departments } from '../data/departments'

/**
 * Route table.
 *
 * Every page is code-split: the home route ships on first paint and the rest
 * arrive on navigation, which keeps the initial bundle to the shell plus one
 * page. Paths come from `constants/routes` so the router and every <Link> in
 * the app read from the same source.
 *
 * A route may carry:
 *   `props`     — fixed context passed to the page (department, collection…),
 *                 which is how one listing component serves many URLs.
 *   `protected` — requires a signed-in account; the guard preserves the
 *                 attempted path so signing in returns the visitor to it.
 */
const HomePage = lazy(() => import('../pages/Home'))
const ShopPage = lazy(() => import('../pages/Shop'))
const DepartmentPage = lazy(() => import('../pages/Department'))
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
const SignupPage = lazy(() => import('../pages/Signup'))
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPassword'))
const ResetPasswordPage = lazy(() => import('../pages/ResetPassword'))
const OrdersPage = lazy(() => import('../pages/Orders'))
const OrderDetailPage = lazy(() => import('../pages/Orders/OrderDetail'))
const AccountPage = lazy(() => import('../pages/Account'))
const AccountProfilePage = lazy(() => import('../pages/Account/Profile'))
const AccountOrdersPage = lazy(() => import('../pages/Account/Orders'))
const AccountAddressesPage = lazy(() => import('../pages/Account/Addresses'))
const AccountPaymentsPage = lazy(() => import('../pages/Account/PaymentMethods'))
const AccountNotificationsPage = lazy(() => import('../pages/Account/Notifications'))
const AccountRecentlyViewedPage = lazy(() => import('../pages/Account/RecentlyViewed'))
const AccountSettingsPage = lazy(() => import('../pages/Account/Settings'))
const NotFoundPage = lazy(() => import('../pages/NotFound'))

/**
 * `/men`, `/men/:category`, `/women`, `/women/:category` — generated from the
 * department list rather than hand-written, so a new department needs no route
 * changes. Static paths are declared explicitly instead of a `/:department`
 * wildcard, which would otherwise swallow `/sale`, `/cart` and everything else.
 */
const departmentRoutes = departments.flatMap((department) => [
  {
    path: ROUTES.department(department.slug),
    Component: DepartmentPage,
    props: { department: department.slug },
  },
  {
    path: `${ROUTES.department(department.slug)}/:category`,
    Component: ShopPage,
    props: { department: department.slug },
  },
])

export const routes = [
  { path: ROUTES.home, Component: HomePage },

  // Catalogue
  ...departmentRoutes,
  { path: ROUTES.shop, Component: ShopPage },
  { path: `${ROUTES.shop}/:category`, Component: ShopPage },
  { path: '/product/:slug', Component: ProductDetailsPage },
  { path: ROUTES.collections, Component: CollectionsPage },
  { path: `${ROUTES.collections}/:slug`, Component: CollectionDetailPage },

  // Editorial listings
  {
    path: ROUTES.newArrivals,
    Component: ShopPage,
    props: { collection: 'new-arrivals', title: 'New Arrivals' },
  },
  {
    path: ROUTES.bestSellers,
    Component: ShopPage,
    props: { collection: 'best-sellers', title: 'Best Sellers' },
  },
  { path: ROUTES.sale, Component: ShopPage, props: { saleOnly: true, title: 'Sale' } },

  // Content
  { path: ROUTES.about, Component: AboutPage },
  { path: ROUTES.contact, Component: ContactPage },
  { path: ROUTES.search, Component: SearchPage },

  // Commerce
  { path: ROUTES.cart, Component: CartPage },
  { path: ROUTES.checkout, Component: CheckoutPage },
  { path: ROUTES.wishlist, Component: WishlistPage },

  // Auth
  { path: ROUTES.login, Component: LoginPage },
  { path: ROUTES.signup, Component: SignupPage },
  { path: ROUTES.forgotPassword, Component: ForgotPasswordPage },
  { path: ROUTES.resetPassword, Component: ResetPasswordPage },

  // Orders + account (signed-in only)
  { path: ROUTES.orders, Component: OrdersPage, protected: true },
  { path: '/orders/:id', Component: OrderDetailPage, protected: true },
  { path: ROUTES.account, Component: AccountPage, protected: true },
  { path: ROUTES.accountProfile, Component: AccountProfilePage, protected: true },
  { path: ROUTES.accountOrders, Component: AccountOrdersPage, protected: true },
  { path: ROUTES.accountAddresses, Component: AccountAddressesPage, protected: true },
  { path: ROUTES.accountPayments, Component: AccountPaymentsPage, protected: true },
  { path: ROUTES.accountNotifications, Component: AccountNotificationsPage, protected: true },
  { path: ROUTES.accountRecentlyViewed, Component: AccountRecentlyViewedPage, protected: true },
  { path: ROUTES.accountSettings, Component: AccountSettingsPage, protected: true },

  { path: '*', Component: NotFoundPage },
]

export default routes
