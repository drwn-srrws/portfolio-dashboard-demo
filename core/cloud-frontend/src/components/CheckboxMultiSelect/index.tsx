import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { SelectAll } from "@/utils/forms";
import { cn } from "@/utils/utils";

import { Selectable } from "@typings/Selectable";
import { Badge, Button } from "@components/ui";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { VirtualList } from "../VirtualList";

interface CheckboxMultiSelectProps {
  options: Selectable[];
  onChange: (selected: (string | number | boolean)[]) => void;
  values?: (string | number | boolean)[];
  placeholder?: ReactNode;
  className?: string;
  minSelectable?: number;
  maxSelectable?: number;
  testId?: string;
}

interface CheckboxMultiSelectItem extends Selectable {
  selected: boolean;
}

export const CheckboxMultiSelect = ({
  options,
  onChange,
  placeholder,
  values,
  className,
  minSelectable = 0,
  maxSelectable = Infinity,
  testId,
}: CheckboxMultiSelectProps) => {
  const [items, setItems] = useState<CheckboxMultiSelectItem[]>(
    options.map((option) => ({
      ...option,
      selected: false,
    }))
  );

  useEffect(() => {
    const optionsWithSelected = options.map((option) => ({
      ...option,
      selected: values?.includes(String(option.value)) || false,
    }));

    setItems(optionsWithSelected);
  }, [options, values]);

  const selectedItems = useMemo(
    () => items.filter((item) => item.selected).map((item) => item.value),
    [items]
  );

  const toggleItemSelection = useCallback(
    (value: string | number | boolean, selected: boolean) => {
      let updatedItems: CheckboxMultiSelectItem[] = items.map((item) =>
        item.value === value ? { ...item, selected } : item
      );

      if (value === SelectAll.value) {
        // We cannot deselect the "all" option
        if (!selected) return;
        else {
          // If the "all" option is selected, then all other options should be deselected.
          updatedItems = updatedItems.map((option) => ({
            ...option,
            selected: option.value === SelectAll.value,
          }));
        }
      } else {
        const currentSelectionCount = updatedItems.filter(
          (item) => item.selected
        ).length;

        if (selected && currentSelectionCount > maxSelectable) {
          return;
        }

        if (!selected && currentSelectionCount < minSelectable) {
          return;
        }
        // If an option other than "all" is selected, then the "all" option should be deselected.
        updatedItems = updatedItems.map((option) => {
          const isSelectAll = option.value === SelectAll.value;
          const isCurrentItem = option.value === value;

          return {
            ...option,
            selected: isSelectAll
              ? false
              : isCurrentItem
                ? selected
                : option.selected,
          };
        });
      }

      setItems(updatedItems);

      const newValues = updatedItems
        .filter((item) => item.selected)
        .map((item) => item.value);

      onChange(newValues);
    },
    [items, onChange, maxSelectable, minSelectable]
  );

  const valueIsNotSelectAll =
    selectedItems.length > 0 && selectedItems[0] !== SelectAll.value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative w-full" asChild>
        <Button
          variant="outline"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-1",
            className
          )}
          data-testid={testId}
        >
          {valueIsNotSelectAll && (
            <div className="absolute left-2 top-2">
              <Badge>{selectedItems.length}</Badge>
            </div>
          )}
          <p
            className={`transition-all ${valueIsNotSelectAll ? "ml-8" : "ml-0"}`}
          >
            {placeholder || "Select options"}
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width]">
        <VirtualList items={items} maxHeight={200}>
          {(option) => (
            <DropdownMenuCheckboxItem
              key={String(option.value)}
              className="w-full"
              checked={option.selected}
              onCheckedChange={(checked) =>
                toggleItemSelection(option.value, checked)
              }
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          )}
        </VirtualList>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
