import { forwardRef, useCallback, useMemo, useState } from "react";

import { FormControl, FormControlProps } from "@/components/Form/FormControl";
import { Icon } from "@/components/Icon/Icon";
import { Selectable } from "@typings/Selectable";

import {
  Button,
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui";
import { VirtualList } from "../VirtualList";
import { SortableListPicker } from "./SortableListPicker";

export interface SortableListSelectProps extends FormControlProps {
  withSearch?: boolean;
  value?: string[];
  options: Selectable[];
  placeholder?: string;
  testId?: string;
  isEmptyState?: boolean;
  selectedPlaceholder?: string;
  onChange?: (value: string[]) => void;
}

export const SortableListSelect = forwardRef<
  HTMLDivElement,
  SortableListSelectProps
>(
  (
    {
      value = [],
      options,
      placeholder = "Select",
      testId,
      onChange,
      withSearch = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const selectedOptions = useMemo(() => {
      const foundOptions = value?.map(
        (value) =>
          options.find((option) => option.value === value) as Selectable
      );

      return foundOptions?.filter(Boolean) ?? [];
    }, [options, value]);

    const filteredOptions = useMemo(() => {
      if (!searchQuery) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);

    const handleToggleOption = useCallback(
      (option: Selectable) => {
        onChange?.(
          value?.includes(String(option.value))
            ? value?.filter((value) => value !== String(option.value))
            : [...(value ?? []), String(option.value)]
        );
      },
      [onChange, value]
    );

    return (
      <FormControl {...props} data-testid={testId}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild data-testid={`${testId}-popover-trigger`}>
            <div
              ref={ref}
              tabIndex={0}
              className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-md border border-neutral-700 p-1"
            >
              <div className="flex w-full items-center justify-between">
                <span className="px-1 text-zinc-400">{placeholder}</span>
                <Icon
                  name="ChevronDown"
                  size="sm"
                  color="#a3a3a3"
                  className="mr-1"
                />
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="badge-popover flex w-[var(--radix-popover-trigger-width)] flex-col"
            onWheel={(e) => e.stopPropagation()}
            disablePortal
            data-testid={`badge-select-popover-content`}
          >
            {withSearch && (
              <div className="relative mb-2 flex w-full items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-950/60">
                <Icon
                  name="Search"
                  size="lg"
                  color="#B3B3B3"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                />
                <Input
                  className="mt-0 h-auto w-full border-none py-2 pl-9 pr-3 text-white placeholder:text-gray-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <VirtualList
              items={filteredOptions}
              maxHeight={200}
              testId={`${testId}-virtual-list-container`}
            >
              {(option) => (
                <Button
                  key={String(option.value)}
                  asChild
                  variant="ghost"
                  className="w-full justify-start px-2"
                  onClick={() => handleToggleOption(option)}
                  data-testid={`${option.value}`}
                >
                  <div>
                    <Checkbox
                      checked={value?.includes(String(option.value))}
                      className="mr-2"
                    />
                    {option.label}
                  </div>
                </Button>
              )}
            </VirtualList>
          </PopoverContent>
        </Popover>

        {selectedOptions.length > 0 && onChange && (
          <SortableListPicker
            value={selectedOptions}
            onChange={onChange}
            testId={testId}
          />
        )}
      </FormControl>
    );
  }
);
