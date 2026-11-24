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

export interface InfiniteTextSelectOption {
  label: string;
  value: string;
}

export interface InfiniteTextSelectProps extends FormControlProps {
  disableClearable?: boolean;
  disableFiltering?: boolean;
  required?: boolean;
  value?: { value: string; label: string } | null;
  search?: string;
  isLoadingOptions?: boolean;
  isLoadingMore?: boolean;
  options: InfiniteTextSelectOption[];
  placeholder?: string;
  optionsPlaceholder?: ReactNode;
  testId?: string;
  onChange?: (value: InfiniteTextSelectOption | null) => void;
  onValueChange?: (value: InfiniteTextSelectOption | null) => void;
  onLoadMore?: () => void;
  onSearchChange?: (value: string) => void;
}

export const InfiniteTextSelect = ({
  disableClearable,
  disableFiltering,
  testId,
  required,
  options,
  search: propSearch,
  isLoadingMore,
  isLoadingOptions,
  placeholder = "Select an option",
  optionsPlaceholder = "No options",
  onChange,
  onValueChange,
  onLoadMore,
  onSearchChange,
  ...props
}: InfiniteTextSelectProps) => {
  const [_search, _setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="flex items-center gap-2 relative">
          <PopoverTrigger className="w-full" asChild>
            <Button
              variant="outline"
              className="bg-transparent justify-between"
              data-testid={testId}
            >
              {props.value?.label ?? placeholder}
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
          disablePortal
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
                      isSelected={String(props.value) === String(option.value)}
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
