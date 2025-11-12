/**
 * Toast context value type and context creation
 */

import { createContext } from 'react'
import type { Toast, ToastType } from '../../components/ui/toast'

export interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  showToast: (type: ToastType, title: string, description?: string, duration?: number) => string
  success: (title: string, description?: string) => string
  error: (title: string, description?: string) => string
  warning: (title: string, description?: string) => string
  info: (title: string, description?: string) => string
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

