import { JSX } from "react";
import { cn } from "@/utils";
import { defaultPercentageBarColors } from "../../constants/percentageBarColors";

interface Tag {
  label: string;
  value: number;
}

interface PercentageBarProps {
  tags: Tag[];
  className?: string;
}

export const PercentageBar = ({ tags, className }: PercentageBarProps) => {
  const gapInPercent = 1.5;

  const elements = tags.reduce<{ elements: JSX.Element[]; position: number }>(
    (acc, tag, index) => {
      const value =
        index < tags.length - 1 ? tag.value - gapInPercent : tag.value;

      const element = (
        <div
          key={tag.label}
          className="absolute h-full transition-all"
          style={{
            width: `${value}%`,
            left: `${acc.position}%`,
            backgroundColor:
              defaultPercentageBarColors[
                index % defaultPercentageBarColors.length
              ],
          }}
        />
      );

      return {
        elements: [...acc.elements, element],
        position:
          acc.position + value + (index < tags.length - 1 ? gapInPercent : 0),
      };
    },
    { elements: [], position: 0 }
  );

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
    >
      {elements.elements}
    </div>
  );
};
