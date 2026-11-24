import { ReactNode, useCallback, useMemo, useState } from "react";
import { FormControl, FormControlProps } from "@/components/Form/FormControl";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@components/ui";
import { VirtualList } from "@/components/VirtualList";
import { InfiniteAutocompleteItem } from "./InfiniteAutocompleteItem";

export interface InfiniteAutocompleteOption {
  label: string;
  value: string;
}

export interface InfiniteAutocompleteProps extends FormControlProps {
  disableClearable?: boolean;
  disableFiltering?: boolean;
  required?: boolean;
  value?: string;
  isLoadingOptions?: boolean;
  isLoadingMore?: boolean;
  options: InfiniteAutocompleteOption[];
  placeholder?: string;
  optionsPlaceholder?: ReactNode;
  testId?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  onLoadMore?: () => void;
}

export const InfiniteAutocomplete = ({
  disableFiltering,
  required,
  options,
  value: propValue,
  isLoadingMore,
  isLoadingOptions,
  placeholder = "Select an option",
  optionsPlaceholder = "No options",
  onChange,
  onValueChange,
  onLoadMore,
  ...props
}: InfiniteAutocompleteProps) => {
  const [_value, _setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const value = propValue ?? _value;

  const isControlled = value === undefined;

  const setValue = useCallback(
    (value: string) => {
      if (isControlled) _setValue(value);
      onChange?.(value);
      onValueChange?.(value);
    },
    [isControlled, onChange, onValueChange]
  );

  const filteredOptions = useMemo(() => {
    if (disableFiltering) return options;
    return options.filter((option) =>
      option.label.toString().toLowerCase().includes(value.toLowerCase())
    );
  }, [disableFiltering, options, value]);

  const handleSelect = useCallback(
    (value: string) => {
      setValue(value);
    },
    [setValue]
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
      <Command
        shouldFilter={false}
        autoFocus={false}
        className='border border-neutral-800 rounded-lg bg-transparent [&_[data-id="command/input-wrapper"]]:border-0 [&_[data-id="command/input-wrapper/icon"]]:hidden'
      >
        <Popover open={isOpen}>
          <PopoverAnchor>
            <CommandInput
              placeholder={placeholder}
              value={value}
              className="py-2 h-auto "
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              onValueChange={setValue}
            />
          </PopoverAnchor>

          <PopoverContent
            className="p-0 min-w-[var(--radix-popover-trigger-width)] rounded-md border bg-neutral-950"
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
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
                    <InfiniteAutocompleteItem
                      data={option}
                      onSelect={handleSelect}
                    />
                  )}
                </VirtualList>
              </CommandGroup>
            </CommandList>
          </PopoverContent>
        </Popover>
      </Command>
    </FormControl>
  );
};
