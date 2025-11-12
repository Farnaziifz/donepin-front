/**
 * People page - Manage team members
 */

import { usePeople } from '../../lib/hooks/queries/use-people'
import { EmptyState } from '../../components/ui/empty-state'
import { Skeleton } from '../../components/ui/skeleton'
import { formatDate } from '../../lib/utils/format'

export function PeoplePage() {
  const { data: people, isLoading, error } = usePeople()

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          Failed to load people. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">People</h1>
        <p className="text-muted-foreground">Manage your team members and collaborators</p>
      </div>

      {people && people.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person) => (
            <div
              key={person.id}
              className="rounded-lg border border-border bg-background p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-lg font-semibold text-primary-800 dark:text-primary-300">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{person.name}</h3>
                  {person.email && (
                    <p className="text-sm text-muted-foreground">{person.email}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Added {formatDate(person.createdAt)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="👥"
          title="No people yet"
          description="Add team members to collaborate on tasks"
        />
      )}
    </div>
  )
}

