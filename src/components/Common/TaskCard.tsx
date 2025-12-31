import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTasks } from '@/contexts/TaskContext';
import { formatDateTime, formatDateTimeLocal, isOverdue } from '@/lib/time';
import { cn } from '@/lib/utils';
import type { Status, Task } from '@/types';
import { MOCK_USERS } from '@/types/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ListChecks,
  MoreVertical,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import React, { memo, useState } from 'react';
import { StatusSelector } from './StatusSelector';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = memo(({ task, onClick }) => {
  const { dispatch } = useTasks();
  const [isExpanded, setIsExpanded] = useState(false);

  const totalChecklistItems =
    task.checklists?.reduce((sum, cl) => sum + cl.items.length, 0) || 0;
  const completedChecklistItems =
    task.checklists?.reduce(
      (sum, cl) => sum + cl.items.filter((i) => i.isCompleted).length,
      0
    ) || 0;
  const assignedUsers = MOCK_USERS.filter((u) =>
    task.assignedUserIds?.includes(u.id)
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getTimestampText = () => {
    switch (task.status) {
      case 'new':
        return `Created: ${formatDateTime(task.createdAt)}`;
      case 'ongoing':
        return task.movedToOngoingAt
          ? `Started: ${formatDateTime(task.movedToOngoingAt)}`
          : `Created: ${formatDateTime(task.createdAt)}`;
      case 'done':
        return task.completedAt
          ? `Completed: ${formatDateTime(task.completedAt)}`
          : `Created: ${formatDateTime(task.createdAt)}`;
      default:
        return `Created: ${formatDateTime(task.createdAt)}`;
    }
  };

  const isTaskOverdue = task.status === 'ongoing' && isOverdue(task.dueAt);

  const handleMove = (toStatus: Status) => {
    dispatch({ type: 'MOVE_TASK', payload: { id: task.id, toStatus } });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
  };

  const handleSetDue = (dueAt?: string) => {
    dispatch({ type: 'SET_DUE', payload: { id: task.id, dueAt } });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'group bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200',
        'focus-within:ring-2 focus-within:ring-primary/20 cursor-pointer active:cursor-grabbing relative overflow-hidden',
        isTaskOverdue && 'border-destructive/50 shadow-destructive/5',
        isDragging && 'opacity-50 scale-95 cursor-grabbing'
      )}
      tabIndex={0}
      role="group"
      aria-label={`Task: ${task.title}`}
    >
      {/* Accent bar for status */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1 transition-colors',
          task.status === 'new' && 'bg-blue-500/50',
          task.status === 'ongoing' && 'bg-amber-500/50',
          task.status === 'done' && 'bg-green-500/50',
          isTaskOverdue && 'bg-destructive animate-pulse'
        )}
      />

      <div className="flex items-start justify-between gap-3 mb-2 ml-1">
        <h3 className="font-semibold text-card-foreground leading-tight tracking-tight">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-full"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuSeparator />
              {task.status !== 'new' && (
                <DropdownMenuItem onClick={() => handleMove('new')}>
                  Move to New
                </DropdownMenuItem>
              )}
              {task.status !== 'ongoing' && (
                <DropdownMenuItem onClick={() => handleMove('ongoing')}>
                  Move to Ongoing
                </DropdownMenuItem>
              )}
              {task.status !== 'done' && (
                <DropdownMenuItem onClick={() => handleMove('done')}>
                  Move to Done
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 ml-1">
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <StatusSelector
            currentStatus={task.status}
            onStatusChange={handleMove}
          />
        </div>
        {isTaskOverdue && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground animate-in zoom-in">
            Overdue
          </span>
        )}
      </div>

      {task.description && (
        <div className="mb-4 ml-1">
          <div
            className={cn(
              'text-sm text-muted-foreground transition-all duration-300',
              !isExpanded && 'line-clamp-2'
            )}
          >
            {task.description}
          </div>
          {task.description.length > 80 && (
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs font-medium text-primary hover:no-underline mt-1"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <span className="flex items-center gap-1">
                  <ChevronUp className="h-3 w-3" /> Show less
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <ChevronDown className="h-3 w-3" /> Show more
                </span>
              )}
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3 pt-3 border-t border-border/40 ml-1">
        {task.status === 'ongoing' && (
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
            <input
              type="datetime-local"
              value={task.dueAt ? formatDateTimeLocal(task.dueAt) : ''}
              onChange={(e) =>
                handleSetDue(
                  e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined
                )
              }
              onPointerDown={(e) => e.stopPropagation()}
              className={cn(
                'text-xs bg-transparent border-none p-0 focus:ring-0 cursor-pointer text-muted-foreground hover:text-foreground transition-colors',
                isTaskOverdue && 'text-destructive font-medium'
              )}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {totalChecklistItems > 0 && (
              <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                <ListChecks className="h-3 w-3" />
                <span>
                  {completedChecklistItems}/{totalChecklistItems}
                </span>
              </div>
            )}
            <div className="text-[11px] text-muted-foreground/60 italic">
              {getTimestampText()}
            </div>
          </div>

          {assignedUsers.length > 0 && (
            <div className="flex -space-x-2">
              {assignedUsers.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="w-6 h-6 rounded-full border-2 border-background overflow-hidden bg-muted"
                  title={user.name}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {assignedUsers.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[8px] font-bold">
                  +{assignedUsers.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
