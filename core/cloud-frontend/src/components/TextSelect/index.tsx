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
  SelectSeparator,
} from "@components/ui";
import { VirtualList } from "../VirtualList";
import { TextSelectItem } from "./TextSelectItem";

export interface TextSelectOption {
  label: string;
  value: string | number | boolean;
}

export interface TextSelectAdornmentProps {
  handleClose: (func: () => void) => () => void;
}

export interface TextSelectProps extends FormControlProps {
  virtual?: boolean;
  required?: boolean;
  disabled?: boolean;
  value?: string | number | boolean | null;
  options: TextSelectOption[];
  placeholder?: string;
  optionsPlaceholder?: ReactNode;
  testId?: string;
  disablePortal?: boolean;
  renderStartAdornment?: (props: TextSelectAdornmentProps) => ReactNode;
  renderEndAdornment?: (props: TextSelectAdornmentProps) => ReactNode;
  onChange?: (value: string | number | boolean) => void;
  onValueChange?: (value: string | number | boolean) => void;
}

export const TextSelect = ({
  testId,
  virtual,
  required,
  disabled = false,
  options,
  placeholder = "Select an option",
  optionsPlaceholder = "No options",
  disablePortal = false,
  renderStartAdornment,
  renderEndAdornment,
  onChange,
  onValueChange,
  ...props
}: TextSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === props.value);
  }, [options, props.value]);

  const handleClose = useCallback(
    (func: () => void) => () => {
      func();
      setIsOpen(false);
    },
    [setIsOpen]
  );

  const handleSelect = useCallback(
    (value: string) => {
      if (disabled) return;
      const option = options.find((option) => `${option.value}` === value);
      if (!option) return;
      onValueChange?.(option.value);
      onChange?.(option.value);
      setIsOpen(false);
    },
    [disabled, onChange, onValueChange, options]
  );

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <FormControl {...props} required={required}>
      <Popover
        {...props}
        open={!disabled && isOpen}
        onOpenChange={disabled ? undefined : setIsOpen}
      >
        <PopoverTrigger className="w-full" asChild>
          <Button
            variant="outline"
            className="bg-transparent justify-between w-full"
            data-testid={testId}
            disabled={disabled}
          >
            {selectedOption?.label ?? placeholder}
            <ChevronDown className="ml-2 -mr-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          disablePortal={disablePortal}
          className="p-0 min-w-[var(--radix-popover-trigger-width)] rounded-md border bg-neutral-950"
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {renderStartAdornment && (
            <>
              {renderStartAdornment({ handleClose })}
              <SelectSeparator />
            </>
          )}

          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>{optionsPlaceholder}</CommandEmpty>
              <CommandGroup>
                {!virtual ? (
                  filteredOptions.map((option) => (
                    <TextSelectItem
                      testId={`${testId}-option-${option.value}`}
                      key={`${option.value}`}
                      data={option}
                      isSelected={selectedOption?.value === option.value}
                      onSelect={handleSelect}
                    />
                  ))
                ) : (
                  <VirtualList
                    items={filteredOptions}
                    estimateSize={29}
                    maxHeight={200}
                  >
                    {(option) => (
                      <TextSelectItem
                        data={option}
                        isSelected={selectedOption?.value === option.value}
                        onSelect={handleSelect}
                      />
                    )}
                  </VirtualList>
                )}
              </CommandGroup>
            </CommandList>
          </Command>

          {renderEndAdornment && (
            <>
              <SelectSeparator />
              {renderEndAdornment({ handleClose })}
            </>
          )}
        </PopoverContent>
      </Popover>
    </FormControl>
  );
};
