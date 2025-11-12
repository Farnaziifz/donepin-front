/**
 * Toast provider component
 */

import { useCallback, useState, type ReactNode } from 'react'
import type { Toast, ToastType } from '../../components/ui/toast'
import { ToastContext } from './toast-context-value'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    }
    setToasts((prev) => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (type: ToastType, title: string, description?: string, duration?: number) => {
      return addToast({ type, title, description, duration })
    },
    [addToast]
  )

  const success = useCallback(
    (title: string, description?: string) => {
      return showToast('success', title, description)
    },
    [showToast]
  )

  const error = useCallback(
    (title: string, description?: string) => {
      return showToast('error', title, description, 7000)
    },
    [showToast]
  )

  const warning = useCallback(
    (title: string, description?: string) => {
      return showToast('warning', title, description)
    },
    [showToast]
  )

  const info = useCallback(
    (title: string, description?: string) => {
      return showToast('info', title, description)
    },
    [showToast]
  )

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}


