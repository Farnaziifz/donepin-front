/**
 * Keyboard shortcuts helper component
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../../lib/store/ui-store'

export function KeyboardShortcuts() {
  const navigate = useNavigate()
  const { toggleSidebar, setIsCreateNoteDialogOpen, setIsCreateTaskDialogOpen } = useUIStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      // Ctrl/Cmd + K for command palette (future feature)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        // Command palette can be added here
        return
      }

      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
        return
      }

      // Ctrl/Cmd + N for new note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !e.shiftKey) {
        e.preventDefault()
        setIsCreateNoteDialogOpen(true)
        return
      }

      // Ctrl/Cmd + Shift + N for new task
      if ((e.ctrlKey || e.metaKey) && e.key === 'N') {
        e.preventDefault()
        setIsCreateTaskDialogOpen(true)
        return
      }

      // Number keys for navigation (when not typing)
      if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const routes = ['/inbox', '/today', '/board', '/people', '/analytics', '/settings']
        const index = parseInt(e.key) - 1
        if (routes[index]) {
          navigate(routes[index])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, toggleSidebar, setIsCreateNoteDialogOpen, setIsCreateTaskDialogOpen])

  return null
}

