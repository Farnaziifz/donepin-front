/**
 * Main layout wrapper
 */

import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { OfflineIndicator } from './offline-indicator'
import { PWAInstallPrompt } from './pwa-install-prompt'
import { SkipLink } from '../skip-link'
import { KeyboardShortcuts } from './keyboard-shortcuts'

export function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SkipLink />
      <KeyboardShortcuts />
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden lg:pl-64">
        <Header />
        <main id="main-content" className="flex-1 overflow-y-auto bg-background" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <OfflineIndicator />
      <PWAInstallPrompt />
    </div>
  )
}

