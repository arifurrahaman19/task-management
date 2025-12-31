import React, { useState } from 'react';
import type { Checklist } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ListChecks, CheckCircle2, Circle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditableText } from './EditableText';

interface ChecklistManagerProps {
  checklists: Checklist[];
  onAddChecklist: (title: string) => void;
  onAddItem: (checklistId: string, title: string) => void;
  onToggleItem: (checklistId: string, itemId: string) => void;
  onUpdateChecklistTitle: (checklistId: string, title: string) => void;
  disabled?: boolean;
}

export const ChecklistManager: React.FC<ChecklistManagerProps> = ({
  checklists,
  onAddChecklist,
  onAddItem,
  onToggleItem,
  onUpdateChecklistTitle,
  disabled = false,
}) => {
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [addingItemTo, setAddingItemTo] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistTitle.trim()) {
      onAddChecklist(newChecklistTitle.trim());
      setNewChecklistTitle('');
      setIsAddingChecklist(false);
    }
  };

  const handleAddItem = (checklistId: string) => {
    if (newItemTitle.trim()) {
      onAddItem(checklistId, newItemTitle.trim());
      setNewItemTitle('');
      setAddingItemTo(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-primary" />
          Checklists
        </h3>
        {!disabled && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-2 hover:bg-primary/10 hover:text-primary"
            onClick={() => setIsAddingChecklist(true)}
          >
            <Plus className="w-3 h-3 mr-1" /> Add Checklist
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {isAddingChecklist && (
          <form
            onSubmit={handleAddChecklist}
            className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg animate-in fade-in slide-in-from-top-2"
          >
            <Input
              className="h-8 text-sm"
              value={newChecklistTitle}
              onChange={(e) => setNewChecklistTitle(e.target.value)}
              placeholder="Checklist title..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsAddingChecklist(false);
              }}
            />
            <Button type="submit" size="sm" className="h-8 px-3">
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setIsAddingChecklist(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        )}

        {checklists.map((checklist) => (
          <div key={checklist.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <EditableText
                value={checklist.title}
                onSave={(title) => onUpdateChecklistTitle(checklist.id, title)}
                className="text-sm font-medium text-foreground/80 lowercase first-letter:uppercase"
                inputClassName="h-7 text-sm py-0 shadow-none border-0 focus-visible:ring-1"
                disabled={disabled}
              />
              <div className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {checklist.items.filter((i) => i.isCompleted).length}/
                {checklist.items.length}
              </div>
            </div>

            <div className="space-y-1.5 ml-1">
              {checklist.items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center gap-3 group py-1',
                    !disabled && 'cursor-pointer'
                  )}
                  onClick={() =>
                    !disabled && onToggleItem(checklist.id, item.id)
                  }
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground/50 shrink-0 group-hover:text-muted-foreground" />
                  )}
                  <span
                    className={cn(
                      'text-sm transition-all',
                      item.isCompleted
                        ? 'text-muted-foreground line-through opacity-70'
                        : 'text-foreground hover:text-primary'
                    )}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            {!disabled && (
              <>
                {addingItemTo === checklist.id ? (
                  <div className="flex flex-col gap-2 mt-2 pl-7">
                    <Input
                      className="h-8 text-sm"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder="What needs to be done?"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddItem(checklist.id);
                        if (e.key === 'Escape') setAddingItemTo(null);
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-7 text-xs px-3"
                        onClick={() => handleAddItem(checklist.id)}
                      >
                        Add Item
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-3"
                        onClick={() => setAddingItemTo(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground ml-7"
                    onClick={() => setAddingItemTo(checklist.id)}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add an item
                  </Button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
