import { Chip } from "@/components/Chip";

export interface WeightedAttributeItem {
  label: string;
  value: number;
}

interface WeightedAttributeChipProps {
  item: WeightedAttributeItem;
  color: string;
  variant?: "filled" | "default" | null | undefined;
}

export const WeightedAttributeChip = ({
  item,
  color,
  variant = "filled",
}: WeightedAttributeChipProps) => {
  return (
    <div className="flex gap-2 items-center">
      <Chip name={item.label} color={color} variant={variant} size="md" />
    </div>
  );
};
