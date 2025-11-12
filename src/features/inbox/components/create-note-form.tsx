/**
 * Create note form component
 */

import { useState } from 'react'
import { useCreateNote } from '../../../lib/hooks/queries'
import { useToast } from '../../../lib/hooks'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { validateNoteContent } from '../../../lib/utils/validators'
import { queueRequest } from '../../../lib/utils/offline-queue'

export function CreateNoteForm() {
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | undefined>()
  const createNote = useCreateNote()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateNoteContent(content)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setError(undefined)

    // Check if offline
    if (!navigator.onLine) {
      // Queue the request
      queueRequest({
        method: 'POST',
        endpoint: '/notes',
        data: { content },
      })
      setContent('')
      toast.info('Note queued', 'Will be synced when online')
      return
    }

    try {
      await createNote.mutateAsync({ content })
      setContent('')
      toast.success('Note created successfully')
    } catch (err) {
      toast.error('Failed to create note', (err as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Quick note"
        placeholder="Capture a thought, idea, or task..."
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          setError(undefined)
        }}
        error={error}
        disabled={createNote.isPending}
      />
      <Button type="submit" disabled={createNote.isPending || !content.trim()}>
        {createNote.isPending ? 'Creating...' : 'Add Note'}
      </Button>
    </form>
  )
}

