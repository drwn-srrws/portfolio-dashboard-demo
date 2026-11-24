import { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui";
import { Chip } from "../../Chip";
import { ILegendOption } from "../types/ILegendOption";
import { cn } from "@/utils";

export interface LegendDropdownProps {
  values: string[];
  options: ILegendOption[];
  onToggle?: (value: string) => void;
}

export const LegendDropdown = ({
  values,
  options,
  onToggle,
}: LegendDropdownProps) => {
  const handleSelect = useCallback(
    (value: string) => (event: Event) => {
      event.preventDefault();
      onToggle?.(value);
    },
    [onToggle]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-[4px] pr-2">
          <span>+ {options.length} More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-52 overflow-y-auto">
        {options.map(({ label, color, value }) => (
          <DropdownMenuItem
            key={value}
            className="cursor-pointer"
            onSelect={handleSelect(value)}
          >
            <Chip
              name={label}
              color={color}
              className={cn(!values.includes(value) && "opacity-50")}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
