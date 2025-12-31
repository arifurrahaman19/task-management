import React, { useEffect } from 'react';
import type { Task } from '@/types/types';
import { EditableText } from './EditableText';
import { UserSelector } from './UserSelector';
import { ChecklistManager } from './ChecklistManager';
import { useTasks } from '@/contexts/TaskContext';
import { X, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/time';
import { StatusSelector } from './StatusSelector';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const { dispatch } = useTasks();

  // Prevent scroll on body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleUpdateTitle = (title: string) => {
    dispatch({ type: 'UPDATE_TASK_TITLE', payload: { id: task.id, title } });
  };

  const handleUpdateDescription = (description: string) => {
    dispatch({
      type: 'UPDATE_TASK_DESCRIPTION',
      payload: { id: task.id, description },
    });
  };

  const handleUpdateStatus = (toStatus: Task['status']) => {
    dispatch({ type: 'MOVE_TASK', payload: { id: task.id, toStatus } });
  };

  const handleToggleAssignee = (userId: string) => {
    dispatch({ type: 'TOGGLE_ASSIGNEE', payload: { id: task.id, userId } });
  };

  const handleAddChecklist = (title: string) => {
    dispatch({ type: 'ADD_CHECKLIST', payload: { taskId: task.id, title } });
  };

  const handleAddChecklistItem = (checklistId: string, title: string) => {
    dispatch({
      type: 'ADD_CHECKLIST_ITEM',
      payload: { taskId: task.id, checklistId, title },
    });
  };

  const handleToggleChecklistItem = (checklistId: string, itemId: string) => {
    dispatch({
      type: 'TOGGLE_CHECKLIST_ITEM',
      payload: { taskId: task.id, checklistId, itemId },
    });
  };
  const handleUpdateChecklistTitle = (checklistId: string, title: string) => {
    dispatch({
      type: 'UPDATE_CHECKLIST_TITLE',
      payload: { taskId: task.id, checklistId, title },
    });
  };

  const isDone = task.status === 'done';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-card border shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <StatusSelector
              currentStatus={task.status}
              onStatusChange={handleUpdateStatus}
            />
            {isDone && (
              <span className="text-[10px] font-bold uppercase tracking-widest bg-green-500/10 text-green-600 px-2 py-0.5 rounded border border-green-500/20">
                Completed
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          <div className="space-y-4">
            <EditableText
              value={task.title}
              onSave={handleUpdateTitle}
              className="text-3xl font-bold tracking-tight text-foreground"
              inputClassName="text-3xl font-bold h-auto py-1 shadow-none border-0 focus-visible:ring-0 px-0"
              disabled={isDone}
            />

            <div className="flex flex-wrap gap-6 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Created {formatDateTime(task.createdAt)}</span>
              </div>
              {task.dueAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due {formatDateTime(task.dueAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-10">
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Description
                </h3>
                <EditableText
                  value={task.description || ''}
                  onSave={handleUpdateDescription}
                  isTextArea
                  className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap"
                  disabled={isDone}
                />
              </section>

              <ChecklistManager
                checklists={task.checklists || []}
                onAddChecklist={handleAddChecklist}
                onAddItem={handleAddChecklistItem}
                onToggleItem={handleToggleChecklistItem}
                onUpdateChecklistTitle={handleUpdateChecklistTitle}
                disabled={isDone}
              />
            </div>

            <aside className="space-y-8 h-fit sticky top-0">
              <section className="space-y-4 p-4 rounded-xl bg-muted/30 border border-muted-foreground/10">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Assigned To
                </h3>
                <UserSelector
                  selectedUserIds={task.assignedUserIds}
                  onSelect={handleToggleAssignee}
                  disabled={isDone}
                />
                {isDone && (
                  <p className="text-[10px] text-muted-foreground italic text-center">
                    Cannot change assignee once completed
                  </p>
                )}
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
