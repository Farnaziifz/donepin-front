/**
 * Main App component
 */

import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './app/providers'
import { useTheme } from './lib/hooks/use-theme'
import { router } from './app/router'
import { ErrorBoundary } from './components/error-boundary'

function AppContent() {
  useTheme() // Initialize theme

  return <RouterProvider router={router} />
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </ErrorBoundary>
  )
}
