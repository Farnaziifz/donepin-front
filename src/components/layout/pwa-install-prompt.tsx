/**
 * PWA install prompt component
 */

import { usePWA } from '../../lib/hooks/use-pwa'
import { Button } from '../ui/button'
import { Modal } from '../ui/modal'

export function PWAInstallPrompt() {
  const { installPrompt, needRefresh, install, update } = usePWA()

  if (!installPrompt && !needRefresh) return null

  return (
    <>
      {/* Update Available Modal */}
      {needRefresh && (
        <Modal
          isOpen={needRefresh}
          onClose={() => {}}
          title="Update Available"
          description="A new version of the app is available. Would you like to update now?"
          footer={
            <>
              <Button variant="outline" onClick={() => {}}>
                Later
              </Button>
              <Button onClick={update}>Update Now</Button>
            </>
          }
        >
          <></>
        </Modal>
      )}

      {/* Install Prompt */}
      {installPrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="rounded-lg border border-border bg-background p-4 shadow-lg">
            <h3 className="font-semibold text-foreground mb-2">Install DonePin</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Install this app on your device for a better experience
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={install}>
                Install
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Dismiss prompt
                  ;(installPrompt as unknown as { dismiss: () => void }).dismiss?.()
                }}
              >
                Not now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

