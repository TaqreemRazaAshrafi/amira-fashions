import { ROUTES } from '../../constants/routes'
import Redirect from '../../components/common/Redirect'

/**
 * `/orders` is the address people remember and the one linked from the footer,
 * but order history lives inside the account dashboard so it keeps the account
 * navigation around it. This forwards rather than duplicating the screen.
 */
export default function OrdersPage() {
  return <Redirect to={ROUTES.accountOrders} />
}
