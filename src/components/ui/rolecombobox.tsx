"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RoleComboboxProps {
  options: string[];
  selectedRole?: string; // Добавляем `?` для предотвращения ошибки
  onChange: (role: string) => void;
}

export function RoleCombobox({
  options = [],
  selectedRole = "",
  onChange,
}: RoleComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (role: string) => {
    onChange(role);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedRole || "Выберите роль"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Поиск ролей..." />
          <CommandList>
            <CommandEmpty>Роли не найдены.</CommandEmpty>
            <CommandGroup>
              {options.map((role) => (
                <CommandItem
                  key={role}
                  value={role}
                  onSelect={() => handleSelect(role)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedRole === role ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {role}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
