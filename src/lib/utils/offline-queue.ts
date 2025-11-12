/**
 * Offline queue management for PWA
 * Queues requests when offline and syncs when online
 */

import { STORAGE_KEYS } from './constants'

export interface QueuedRequest {
  id: string
  method: string
  endpoint: string
  data?: unknown
  timestamp: number
  retries: number
}

const MAX_RETRIES = 3
const QUEUE_KEY = STORAGE_KEYS.OFFLINE_QUEUE

/**
 * Get all queued requests from storage
 */
export function getQueuedRequests(): QueuedRequest[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(QUEUE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Add a request to the offline queue
 */
export function queueRequest(request: Omit<QueuedRequest, 'id' | 'timestamp' | 'retries'>): void {
  if (typeof window === 'undefined') return

  const queuedRequest: QueuedRequest = {
    ...request,
    id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    retries: 0,
  }

  const queue = getQueuedRequests()
  queue.push(queuedRequest)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

/**
 * Remove a request from the queue
 */
export function removeQueuedRequest(id: string): void {
  if (typeof window === 'undefined') return

  const queue = getQueuedRequests()
  const filtered = queue.filter((req) => req.id !== id)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered))
}

/**
 * Clear all queued requests
 */
export function clearQueue(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(QUEUE_KEY)
}

/**
 * Process queued requests when online
 */
export async function processQueue(
  apiCall: (endpoint: string, method: string, data?: unknown) => Promise<unknown>
): Promise<void> {
  if (!navigator.onLine) return

  const queue = getQueuedRequests()
  if (queue.length === 0) return

  const processed: string[] = []
  const failed: QueuedRequest[] = []

  for (const request of queue) {
    try {
      await apiCall(request.endpoint, request.method, request.data)
      processed.push(request.id)
    } catch (error) {
      // Increment retry count
      request.retries += 1
      if (request.retries < MAX_RETRIES) {
        failed.push(request)
      } else {
        // Max retries reached, remove from queue
        console.error(`Failed to process queued request after ${MAX_RETRIES} retries:`, request)
      }
    }
  }

  // Remove processed requests
  processed.forEach((id) => removeQueuedRequest(id))

  // Update failed requests with new retry counts
  if (failed.length > 0) {
    const remaining = getQueuedRequests().filter((req) => !processed.includes(req.id))
    failed.forEach((req) => {
      const existing = remaining.find((r) => r.id === req.id)
      if (existing) {
        existing.retries = req.retries
      } else {
        remaining.push(req)
      }
    })
    localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining))
  }
}

