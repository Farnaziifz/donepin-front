/**
 * Offline indicator component
 */

import { useOffline } from '../../lib/hooks/use-offline'
import { Badge } from '../ui/badge'

export function OfflineIndicator() {
  const { isOnline, queuedCount } = useOffline()

  if (isOnline && queuedCount === 0) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
      {!isOnline ? (
        <Badge variant="warning" className="shadow-lg">
          ⚠️ Offline
        </Badge>
      ) : (
        queuedCount > 0 && (
          <Badge variant="info" className="shadow-lg">
            📤 {queuedCount} queued
          </Badge>
        )
      )}
    </div>
  )
}

