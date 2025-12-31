import React from 'react';
import type { Status } from '@/types/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusChip } from './StatusChip';

interface StatusSelectorProps {
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
  disabled?: boolean;
}

const statusOptions: { value: Status; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'done', label: 'Done' },
];

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <div className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
          <StatusChip status={currentStatus} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={currentStatus === option.value ? 'bg-accent' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
