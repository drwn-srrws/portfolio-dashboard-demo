import { Check, ChevronsUpDown } from "lucide-react";

import { Selectable } from "@typings/Selectable";
import { Button } from "@components/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@/utils/utils";
import { useMemo, useState } from "react";
import { FormControl, FormItem, FormMessage } from "../../form";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";
import { VirtualList } from "@components/VirtualList";

export default function Combobox({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
  const value = fieldConfigItem?.inputProps?.value || "";
  const showLabel = _showLabel === undefined ? true : _showLabel;
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [query, setQuery] = useState("");
  const classes = fieldProps?.classes || "";

  const options = fieldConfigItem?.inputProps?.options as Selectable[];
  if (!fieldConfigItem.inputProps) {
    throw new Error("Combobox field must have inputProps");
  }
  if (!options || options.length === 0) {
    console.warn("Combobox field must have options, provide some soon!");
  }

  const defaultedPlaceholder = fieldProps.placeholder || "Select option";

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue);
    fieldPropsWithoutShowLabel.onChange(newValue);
    setOpen(false);
  };

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  return (
    <div className={`flex flex-row  items-center space-x-2 pt-2 ${classes}`}>
      <FormItem className="flex w-full flex-col justify-start">
        {showLabel && (
          <AutoFormLabel
            label={label || ""}
            isRequired={!!isRequired}
            className="pb-1.5"
          />
        )}
        <FormControl>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
              >
                {selectedValue
                  ? options.find((option) => option.value === selectedValue)
                      ?.label
                  : defaultedPlaceholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              disablePortal
              className="w-[--radix-popover-trigger-width] p-0"
              onWheel={(e) => e.stopPropagation()}
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder={defaultedPlaceholder}
                  value={query}
                  onValueChange={(value) => setQuery(value)}
                />
                <CommandList>
                  <CommandEmpty>No results found</CommandEmpty>
                  <CommandGroup>
                    <VirtualList
                      items={filteredOptions}
                      estimateSize={29}
                      maxHeight={200}
                    >
                      {(option) => (
                        <CommandItem
                          key={String(option.value)}
                          value={String(option.value)}
                          onSelect={(currentValue) =>
                            handleSelect(
                              currentValue === selectedValue ? "" : currentValue
                            )
                          }
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedValue === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      )}
                    </VirtualList>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormControl>
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        <FormMessage />
      </FormItem>
    </div>
  );
}
