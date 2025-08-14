import React from 'react';
import type { Status } from '../state/types';
import { cn } from '../lib/utils';

interface StatusChipProps {
  status: Status;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const statusConfig = {
    new: {
      label: 'New',
      className: 'bg-status-new text-status-new-foreground',
    },
    ongoing: {
      label: 'Ongoing',
      className: 'bg-status-ongoing text-status-ongoing-foreground',
    },
    done: {
      label: 'Done',
      className: 'bg-status-done text-status-done-foreground',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  );
};
