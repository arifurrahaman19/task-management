import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface NewTaskFormProps {
  onSubmit: (title: string, description?: string) => void;
}

export const NewTaskForm: React.FC<NewTaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    onSubmit(title.trim(), description.trim() || undefined);
    setTitle('');
    setDescription('');
    setTitleError('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-card rounded-lg border mb-4"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError('');
          }}
          placeholder="Enter task title..."
          className={titleError ? 'border-destructive' : ''}
        />
        {titleError && <p className="text-sm text-destructive">{titleError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        Add Task
      </Button>
    </form>
  );
};
