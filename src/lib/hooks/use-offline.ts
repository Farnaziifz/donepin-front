/**
 * Hook for managing offline state and queue
 */

import { useEffect, useState } from 'react'
import { useToast } from './index'
import { queueRequest, processQueue, getQueuedRequests } from '../utils/offline-queue'
import { api } from '../api'

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [queuedCount, setQueuedCount] = useState(0)
  const toast = useToast()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.info('Connection restored', 'Syncing queued requests...')
      // Process queued requests when coming back online
      processQueue(async (endpoint: string, method: string, data?: unknown) => {
        // This will be replaced with actual API calls when backend is ready
        if (method === 'POST' && endpoint.includes('/notes')) {
          await api.createNote(data as { content: string })
        }
      }).then(() => {
        setQueuedCount(0)
        toast.success('All queued requests synced')
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.warning('You are offline', 'Your actions will be queued and synced when online')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check queued requests on mount
    setQueuedCount(getQueuedRequests().length)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [toast])

  // Update queued count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setQueuedCount(getQueuedRequests().length)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    isOnline,
    queuedCount,
  }
}

