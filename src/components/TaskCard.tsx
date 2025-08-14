import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, Status } from '../state/types';
import { StatusChip } from './StatusChip';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ui/context-menu';
import { formatDateTime, formatDateTimeLocal, isOverdue } from '../lib/time';
import { cn } from '../lib/utils';
import { MoreVertical } from 'lucide-react';
import { Button } from './ui/button';

interface TaskCardProps {
  task: Task;
  onMove: (id: string, status: Status) => void;
  onSetDue: (id: string, dueAt?: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onMove,
  onSetDue,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contextMenuKey, setContextMenuKey] = useState(0);
  const lastRightClickTime = React.useRef<number>(0);

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

  const getAvailableStatuses = (
    current: Status
  ): { status: Status; label: string }[] => {
    const allStatuses = [
      { status: 'new' as Status, label: 'Move to New' },
      { status: 'ongoing' as Status, label: 'Move to Ongoing' },
      { status: 'done' as Status, label: 'Move to Done' },
    ];

    return allStatuses.filter((item) => item.status !== current);
  };

  const isTaskOverdue = task.status === 'ongoing' && isOverdue(task.dueAt);
  const availableStatuses = getAvailableStatuses(task.status);

  const handleContextMenu = () => {
    const currentTime = Date.now();
    // If the context menu was recently triggered (within 100ms), force remount
    if (currentTime - lastRightClickTime.current < 100) {
      setContextMenuKey((prev) => prev + 1);
    }
    lastRightClickTime.current = currentTime;
  };

  return (
    <ContextMenu key={contextMenuKey}>
      <ContextMenuTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className={cn(
            'bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow',
            'focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer',
            isTaskOverdue && 'border-overdue',
            isDragging && 'opacity-50'
          )}
          tabIndex={0}
          role="button"
          aria-label={`Task: ${task.title}`}
          onContextMenu={handleContextMenu}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-card-foreground line-clamp-2">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusChip status={task.status} />
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Simulate right-click to open context menu at button position
                  const rect = e.currentTarget.getBoundingClientRect();
                  const rightClickEvent = new MouseEvent('contextmenu', {
                    bubbles: true,
                    cancelable: true,
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.bottom,
                  });
                  const taskCard = e.currentTarget.closest('[role="button"]');
                  taskCard?.dispatchEvent(rightClickEvent);
                }}
                aria-label="Move task"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {isTaskOverdue && (
            <div className="mb-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-overdue text-overdue-foreground">
                Overdue
              </span>
            </div>
          )}

          {task.description && (
            <div className="mb-3">
              <p
                className={cn(
                  'text-sm text-muted-foreground',
                  !isExpanded && 'line-clamp-2'
                )}
                onClick={() => setIsExpanded(!isExpanded)}
                onPointerDown={(e) => e.stopPropagation()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                  }
                }}
              >
                {task.description}
              </p>
              {task.description.length > 100 && (
                <button
                  className="text-xs text-primary hover:underline mt-1"
                  onClick={() => setIsExpanded(!isExpanded)}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          )}

          {task.status === 'ongoing' && (
            <div className="mb-3">
              <label className="block text-xs text-muted-foreground mb-1">
                Due Date
              </label>
              <input
                type="datetime-local"
                value={task.dueAt ? formatDateTimeLocal(task.dueAt) : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  onSetDue(
                    task.id,
                    value ? new Date(value).toISOString() : undefined
                  );
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-full text-xs px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            {getTimestampText()}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {availableStatuses.map(({ status, label }) => (
          <ContextMenuItem key={status} onClick={() => onMove(task.id, status)}>
            {label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};
