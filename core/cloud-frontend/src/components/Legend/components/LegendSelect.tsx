import { useCallback, useMemo } from "react";
import { cn } from "@/utils";
import { Chip } from "@components/Chip";
import { ILegendOption } from "../types/ILegendOption";
import { LegendDropdown } from "./LegendDropdown";

export interface LegendSelectProps {
  values: string[];
  options: ILegendOption[];
  maxVisibleItems?: number;
  onChange?: (values: string[]) => void;
}

export const LegendSelect = ({
  values,
  options,
  maxVisibleItems,
  onChange,
}: LegendSelectProps) => {
  const shownOptions = useMemo(
    () =>
      maxVisibleItems !== undefined
        ? options.slice(0, maxVisibleItems)
        : options,
    [options, maxVisibleItems]
  );

  const moreOptions = useMemo(
    () => (maxVisibleItems !== undefined ? options.slice(maxVisibleItems) : []),
    [options, maxVisibleItems]
  );

  const handleToggle = useCallback(
    (value: string) => {
      onChange?.(
        values.includes(value)
          ? values.filter((selectedValue) => selectedValue !== value)
          : [...values, value]
      );
    },
    [onChange, values]
  );

  return (
    <div className="mb-2 flex items-center flex-wrap gap-2">
      {shownOptions.map(({ label, color, value }) => (
        <div key={value} onClick={() => handleToggle(value)}>
          <Chip
            key={value}
            name={label}
            color={color}
            className={cn(
              "rounded-sm bg-neutral-800 p-1 pr-2 select-none",
              !values.includes(value) && "opacity-50"
            )}
          />
        </div>
      ))}
      {!!moreOptions.length && (
        <LegendDropdown
          values={values}
          options={moreOptions}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
};
