import {
  ToggleGroup as ShadToggleGroup,
  ToggleGroupItem,
} from "@components/ui/toggle-group";

import { Selectable } from "@typings/Selectable";
import { Separator } from "@components/ui";

interface ToggleGroupProps {
  options: Selectable[];
  label?: string;
}
type Single = {
  type: "single";
  value: string;
  onChange: (selected: string) => void;
} & ToggleGroupProps;
type Multiple = {
  type: "multiple";
  value: string[];
  onChange: (selected: string[]) => void;
} & ToggleGroupProps;

const ToggleGroupOptions = ({
  options,
  hasHeader = false,
}: {
  options: Selectable[];
  hasHeader?: boolean;
}) =>
  options.map((option, i) => (
    <ToggleGroupItem
      className={`h-10 ${
        i === options.length - 1 || !hasHeader ? "" : "rounded-none"
      }`}
      key={String(option.value)}
      value={String(option.value)}
      aria-label={`Toggle ${option.label}`}
    >
      {option.label}
    </ToggleGroupItem>
  ));

const ToggleGroupHeader = ({ groupTitle }: { groupTitle: string }) => (
  <h3 className="text-sm font-medium text-zinc-950">{groupTitle}</h3>
);

export const ToggleGroup = ({
  type,
  options,
  value,
  onChange,
  label,
}: Single | Multiple) => {
  if (!options || options?.length === 0) {
    console.error("ToggleGroups must be given a non-empty array of options!");
  }

  return (
    <div className="mt-1 flex h-10 items-center rounded-md border-2 border-dashed">
      {label && (
        <div className="flex gap-x-2 pl-2">
          <ToggleGroupHeader groupTitle={label} />
          <Separator orientation="vertical" className="h-5" />
        </div>
      )}
      {type === "single" ? (
        <ShadToggleGroup
          type="single"
          value={value}
          onValueChange={onChange as (selected: string) => void}
        >
          <ToggleGroupOptions options={options} hasHeader={!!label} />
        </ShadToggleGroup>
      ) : (
        <ShadToggleGroup
          type="multiple"
          value={value}
          onValueChange={onChange as (selected: string[]) => void}
        >
          <ToggleGroupOptions options={options} hasHeader={!!label} />
        </ShadToggleGroup>
      )}
    </div>
  );
};
