import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  isTextArea?: boolean;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  isTextArea = false,
  className,
  inputClassName,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (currentValue.trim() !== '' && currentValue !== value) {
      onSave(currentValue);
    } else {
      setCurrentValue(value);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTextArea) {
      handleSave();
    }
    if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing && !disabled) {
    return isTextArea ? (
      <Textarea
        ref={inputRef as React.Ref<HTMLTextAreaElement>}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn('min-h-[100px] resize-none', inputClassName)}
      />
    ) : (
      <Input
        ref={inputRef as React.Ref<HTMLInputElement>}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn('h-8 py-1', inputClassName)}
      />
    );
  }

  return (
    <div
      onClick={() => !disabled && setIsEditing(true)}
      className={cn(
        'cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1 transition-colors min-h-[1.5em]',
        disabled && 'cursor-default hover:bg-transparent',
        className
      )}
    >
      {value || (
        <span className="text-muted-foreground italic">Add details...</span>
      )}
    </div>
  );
};
