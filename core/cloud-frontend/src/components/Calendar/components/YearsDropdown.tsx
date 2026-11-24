import { ChevronDown } from "lucide-react";
import { DropdownProps } from "react-day-picker";
import { useCallback, useState, ChangeEvent } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { Button } from "@components/ui";
import { VirtualList } from "@/components/VirtualList";
import { TextSelectItem } from "@/components/TextSelect/TextSelectItem";

export const YearsDropdown = ({ options, onChange, value }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback(
    (value: string) => {
      const option = options?.find((option) => `${option.value}` === value);
      if (!option) return;

      const event = {
        target: {
          value: option.value,
        },
      } as unknown as ChangeEvent<HTMLSelectElement>;

      onChange?.(event);
      setIsOpen(false);
    },
    [onChange, options]
  );

  if (!value) return null;

  if (!onChange || !options) {
    return (
      <Button variant="ghost" className="p-1 hover:bg-transparent text-sm">
        {value}
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="w-full" asChild>
        <Button variant="ghost" className="p-1 py-0 h-4 hover:bg-transparent">
          {value}
          <ChevronDown className="ml-2 -mr-1 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-[90px] rounded-md border bg-neutral-950"
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No options</CommandEmpty>
            <CommandGroup>
              <VirtualList items={options} estimateSize={29} maxHeight={150}>
                {(option) => (
                  <TextSelectItem
                    key={option.value}
                    data={option}
                    isSelected={value === option.value}
                    onSelect={handleSelect}
                  />
                )}
              </VirtualList>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
