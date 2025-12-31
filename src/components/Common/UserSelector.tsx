import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { MOCK_USERS } from '@/types/types';
import { Check, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';

interface UserSelectorProps {
  selectedUserIds?: string[];
  onSelect: (userId: string) => void;
  disabled?: boolean;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  selectedUserIds = [],
  onSelect,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  const selectedUsers = MOCK_USERS.filter((u) =>
    selectedUserIds.includes(u.id)
  );

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between h-auto py-2 min-h-10 flex-wrap gap-1.5 px-3 border-dashed hover:border-primary/50 transition-all bg-muted/20',
              disabled && 'opacity-70 cursor-not-allowed'
            )}
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedUsers.length > 0 ? (
                selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-1.5 bg-background border shadow-sm pl-1 pr-2 py-0.5 rounded-md text-[11px] font-medium animate-in zoom-in-95"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-4 h-4 rounded-full"
                      />
                    ) : (
                      <UserIcon className="w-3 h-3" />
                    )}
                    <span className="max-w-[80px] truncate">{user.name}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserIcon className="w-4 h-4" />
                  <span>Assign users...</span>
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full" align="start">
          <Command>
            <CommandInput placeholder="Search users..." />
            <CommandList>
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandGroup>
                {MOCK_USERS.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <CommandItem
                      key={user.id}
                      value={user.name}
                      onSelect={() => {
                        onSelect(user.id);
                      }}
                      className="flex items-center justify-between py-2 px-3"
                    >
                      <div className="flex items-center gap-2">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                            <UserIcon className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <div
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-sm border border-primary transition-colors',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
