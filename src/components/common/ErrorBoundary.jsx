import { Component } from 'react'
import { ErrorState } from './States'

/**
 * Catches render-time errors so one broken subtree cannot blank the whole app.
 * Placed around the route outlet in AppLayout.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Replace with your error reporter (Sentry, etc.) in production.
    if (import.meta.env.DEV) console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="shell section-y">
            <ErrorState
              title="Something went wrong."
              description="This section failed to render. Reloading usually fixes it."
              onRetry={() => window.location.reload()}
            />
          </div>
        )
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
