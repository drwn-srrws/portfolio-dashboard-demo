import { CommandItem } from "@/components/ui";
import { InfiniteAutocompleteOption } from ".";
import { CheckIcon } from "lucide-react";

export interface InfiniteAutocompleteItemProps {
  data: InfiniteAutocompleteOption;
  isSelected?: boolean;
  onSelect?: (value: string) => void;
}

export const InfiniteAutocompleteItem = ({
  data,
  isSelected,
  onSelect,
}: InfiniteAutocompleteItemProps) => (
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
