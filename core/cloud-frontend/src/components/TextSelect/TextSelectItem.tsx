import { CheckIcon } from "lucide-react";
import { CommandItem } from "../ui";
import { TextSelectOption } from ".";

export interface TextSelectItemProps {
  data: TextSelectOption;
  isSelected?: boolean;
  testId?: string;
  onSelect?: (value: string) => void;
}

export const TextSelectItem = ({
  data,
  isSelected,
  onSelect,
  testId,
}: TextSelectItemProps) => (
  <CommandItem
    key={`${data.value}`}
    value={`${data.value}`}
    className="justify-between"
    data-testid={testId}
    onSelect={() => onSelect?.(`${data.value}`)}
  >
    {data.label}
    {isSelected && <CheckIcon size={10} />}
  </CommandItem>
);
