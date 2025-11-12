/**
 * Error Boundary component for catching React errors
 */

import { Component, type ReactNode } from 'react'
import { Button } from './ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="max-w-md w-full rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:bg-red-900/30 dark:border-red-800">
            <h1 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">
              Something went wrong
            </h1>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                }}
              >
                Try again
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  window.location.href = '/'
                }}
              >
                Go home
              </Button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-red-700 dark:text-red-400">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-red-600 dark:text-red-500 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

