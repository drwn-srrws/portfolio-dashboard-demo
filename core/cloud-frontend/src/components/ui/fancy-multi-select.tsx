import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  Command as CommandPrimitive,
} from "cmdk";
import { X } from "lucide-react";
import {
  KeyboardEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { Badge } from "@components/ui/badge";

import { Selectable } from "../../typings/Selectable";

interface FancyMultiSelectProps {
  options: Selectable[];
  placeholder: string;
  onChange: (selected: string[]) => void;
  className?: string;
}

export type FancyMultiSelectRef = {
  forceReset: () => void;
};

const getValues = (selected: Selectable[]) => selected.map((s) => s.value);

export const FancyMultiSelect = forwardRef<
  FancyMultiSelectRef,
  FancyMultiSelectProps
>(({ options, placeholder, onChange, className }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Selectable[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback(
    (option: Selectable) => {
      const updatedSelected = selected.filter((s) => s.value !== option.value);
      setSelected(updatedSelected);
      onChange(getValues(updatedSelected) as string[]);
    },
    [onChange, selected]
  );

  useImperativeHandle(ref, () => ({
    forceReset: () => setSelected([]),
  }));

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              onChange(getValues(newSelected) as string[]);
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [onChange]
  );

  const selectables = options.filter((option) => !selected.includes(option));

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={`overflow-visible bg-transparent ${className}`}
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((selectedOption) => (
            <Badge key={String(selectedOption.value)} variant="secondary">
              {selectedOption.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(selectedOption);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(selectedOption)}
              >
                <X className="size-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((selectable) => (
                  <CommandItem
                    key={String(selectable.value)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      const newlySelected = selected.concat(selectable);
                      setSelected(newlySelected);
                      onChange(getValues(newlySelected) as string[]);
                    }}
                    className="cursor-pointer p-2 pl-4"
                  >
                    {selectable.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
});
