/**
 * Task card for Kanban board
 */

import { Draggable } from '@hello-pangea/dnd'
import { useNavigate } from 'react-router-dom'
import type { Task } from '../../../lib/types'
import { Badge } from '../../../components/ui/badge'
import { Tag } from '../../../components/ui/tag'
import { formatDuration, formatRelativeTime } from '../../../lib/utils/format'
import { cn } from '../../../lib/utils/cn'

interface TaskCardProps {
  task: Task
  index: number
}

export function TaskCard({ task, index }: TaskCardProps) {
  const navigate = useNavigate()
  const priorityColors: Record<'LOW' | 'MEDIUM' | 'HIGH', 'info' | 'warning' | 'error'> = {
    LOW: 'info',
    MEDIUM: 'warning',
    HIGH: 'error',
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const handleClick = (e: React.MouseEvent) => {
          // Prevent navigation if dragging
          if (snapshot.isDragging) return
          e.stopPropagation()
          navigate(`/tasks/${task.id}`)
        }

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleClick}
            className={cn(
              'block rounded-lg border border-border bg-background p-4 shadow-sm hover:shadow-md transition-all cursor-pointer',
              snapshot.isDragging && 'opacity-50 shadow-lg'
            )}
          >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-foreground flex-1">{task.title}</h3>
        <Badge variant={priorityColors[task.priority]} size="sm">
          {task.priority}
        </Badge>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
      )}

      {task.estimatedMinutes && (
        <p className="text-xs text-muted-foreground mb-2">⏱ {formatDuration(task.estimatedMinutes)}</p>
      )}

      {task.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap mb-2">
          {task.tags.map((tag) => (
            <Tag key={tag.id} color={tag.color} size="sm">
              {tag.name}
            </Tag>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        {task.assignees.length > 0 && (
          <div className="flex items-center gap-1">
            {task.assignees.slice(0, 3).map((person) => (
              <div
                key={person.id}
                className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-800 dark:text-primary-300"
                title={person.name}
              >
                {person.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {task.assignees.length > 3 && (
              <span className="text-xs text-muted-foreground">+{task.assignees.length - 3}</span>
            )}
          </div>
        )}
        <span className="text-xs text-muted-foreground">{formatRelativeTime(task.updatedAt)}</span>
      </div>
    </div>
        )
      }}
    </Draggable>
  )
}

