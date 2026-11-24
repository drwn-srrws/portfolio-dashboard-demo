import { ReactNode, useCallback, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { FormControl, FormControlProps } from "@/components/Form/FormControl";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui";
import { VirtualList } from "@/components/VirtualList";
import { InfiniteTextSelectItem } from "./InfiniteTextSelectItem";
import { Icon } from "@/components/Icon/Icon";
import { Selectable } from "@/typings/Selectable";
import { cn } from "@/utils";

export interface InfiniteTextSelectOption {
  label: string;
  value: string | number | boolean;
}

export interface InfiniteTextSelectProps extends FormControlProps {
  disableClearable?: boolean;
  disableFiltering?: boolean;
  required?: boolean;
  value?: Selectable | null;
  search?: string;
  isLoadingOptions?: boolean;
  isLoadingMore?: boolean;
  options: Selectable[];
  placeholder?: string;
  optionsPlaceholder?: ReactNode;
  testId?: string;
  disabled?: boolean;
  disablePortal?: boolean;
  onChange?: (value: Selectable | null) => void;
  onValueChange?: (value: Selectable | null) => void;
  onLoadMore?: () => void;
  onSearchChange?: (value: string) => void;
}

export const InfiniteTextSelect = ({
  disableClearable,
  disableFiltering,
  testId,
  required,
  disablePortal,
  options,
  search: propSearch,
  isLoadingMore,
  isLoadingOptions,
  placeholder = "Select an option",
  optionsPlaceholder = "No options",
  disabled,
  onChange,
  onValueChange,
  onLoadMore,
  onSearchChange,
  ...props
}: InfiniteTextSelectProps) => {
  const [_search, _setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const hasClearButton = !disableClearable && !!props.value;

  const search = propSearch ?? _search;

  const setSearch = useCallback(
    (value: string) => {
      if (!propSearch) _setSearch(value);
      onSearchChange?.(value);
    },
    [onSearchChange, propSearch]
  );

  const filteredOptions = useMemo(() => {
    if (disableFiltering) return options;
    return options.filter((option) =>
      option.label.toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search, disableFiltering]);

  const handleSelect = useCallback(
    (value: string) => {
      const option = options.find((option) => `${option.value}` === value);
      if (!option) return;
      onValueChange?.(option);
      onChange?.(option);
      setIsOpen(false);
    },
    [onChange, onValueChange, options]
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

      if (scrollHeight - scrollTop <= clientHeight + 50) {
        onLoadMore?.();
      }
    },
    [onLoadMore]
  );

  return (
    <FormControl {...props} required={required}>
      <Popover {...props} open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            "flex items-center gap-2 relative",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          <PopoverTrigger className="w-full" data-testid={testId} asChild>
            <Button
              variant="outline"
              className={cn(
                "bg-transparent justify-between h-10 w-full gap-2 overflow-hidden"
              )}
              data-testid={`${testId}-trigger-dropdown`}
            >
              <span
                className={cn(
                  "flex-1 min-w-0 truncate text-left",
                  hasClearButton && "mr-4"
                )}
              >
                {props?.value && props?.value?.label?.length > 0
                  ? props.value?.label
                  : placeholder}
              </span>
              <ChevronDown className="ml-2 -mr-1 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          {!disableClearable && props.value && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 mr-8"
              onClick={() => onChange?.(null)}
            >
              <Icon name="X" size="lg" color="#A3A3A3" />
            </Button>
          )}
        </div>

        <PopoverContent
          disablePortal={disablePortal}
          className="p-0 min-w-[var(--radix-popover-trigger-width)] rounded-md border bg-neutral-950"
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {isLoadingOptions ? "Loading..." : optionsPlaceholder}
              </CommandEmpty>
              <CommandGroup>
                <VirtualList
                  items={filteredOptions}
                  estimateSize={29}
                  maxHeight={200}
                  isLoading={isLoadingMore}
                  onScroll={handleScroll}
                >
                  {(option) => (
                    <InfiniteTextSelectItem
                      data={option}
                      isSelected={props.value?.value === option.value}
                      onSelect={handleSelect}
                    />
                  )}
                </VirtualList>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormControl>
  );
};
