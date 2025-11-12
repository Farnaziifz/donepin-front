/**
 * Toast provider wrapper with container
 */

import { type ReactNode } from 'react'
import { ToastProvider as ToastContextProvider } from '../../lib/contexts/toast-context'
import { useToast } from '../../lib/hooks/use-toast'
import { ToastContainer } from '../../components/ui/toast'

function ToastContainerWrapper() {
  const { toasts, removeToast } = useToast()
  return <ToastContainer toasts={toasts} onClose={removeToast} />
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <ToastContextProvider>
      {children}
      <ToastContainerWrapper />
    </ToastContextProvider>
  )
}

