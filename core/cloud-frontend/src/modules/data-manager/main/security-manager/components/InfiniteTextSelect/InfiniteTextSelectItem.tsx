import { CheckIcon } from "lucide-react";
import { CommandItem } from "@/components/ui";
import { InfiniteTextSelectOption } from "./InfiniteTextSelect";

export interface InfiniteTextSelectItemProps {
  data: InfiniteTextSelectOption;
  isSelected?: boolean;
  onSelect?: (value: string) => void;
}

export const InfiniteTextSelectItem = ({
  data,
  isSelected,
  onSelect,
}: InfiniteTextSelectItemProps) => (
  <CommandItem
    key={`${data.value}`}
    value={`${data.value}`}
    className="justify-between"
    onSelect={() => onSelect?.(`${data.value}`)}
  >
    {data.label}
    {isSelected && <CheckIcon size={16} />}
  </CommandItem>
);
