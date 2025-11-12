/**
 * App router configuration
 */

import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '../components/layout/main-layout'
import { InboxPage } from '../features/inbox/page'
import { TodayPage } from '../features/today/page'
import { BoardPage } from '../features/board/page'
import { TaskPage } from '../features/task/page'
import { PeoplePage } from '../features/people/page'
import { AnalyticsPage } from '../features/analytics/page'
import { SettingsPage } from '../features/settings/page'
import { LoginPage } from '../features/auth/pages/login-page'
import { RegisterPage } from '../features/auth/pages/register-page'
import { useAuthStore } from '../lib/store'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

// Public Route Component (redirects to home if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <InboxPage />,
      },
      {
        path: 'inbox',
        element: <InboxPage />,
      },
      {
        path: 'today',
        element: <TodayPage />,
      },
      {
        path: 'board',
        element: <BoardPage />,
      },
      {
        path: 'tasks/:id',
        element: <TaskPage />,
      },
      {
        path: 'people',
        element: <PeoplePage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
])

