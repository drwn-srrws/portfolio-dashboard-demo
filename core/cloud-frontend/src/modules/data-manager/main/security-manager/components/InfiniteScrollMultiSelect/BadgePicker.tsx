import { MouseEvent, useCallback } from "react";
import { Icon } from "@components/Icon/Icon";
import { Selectable } from "@typings/Selectable";

export interface BadgePickerProps {
  value: Selectable[];
  onRemove?: (value: Selectable) => void;
  maxBadgesDisplayed?: number;
}

export const BadgePicker = ({
  value,
  onRemove,
  maxBadgesDisplayed = 4,
}: BadgePickerProps) => {
  const handleRemove = useCallback(
    (item: Selectable) => (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onRemove?.(item);
    },
    [onRemove]
  );

  return (
    <div className="flex-1 flex items-center gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2 overflow-hidden max-w-[calc(100%-10px)]">
        {value.slice(0, maxBadgesDisplayed).map((item) => (
          <button key={String(item.value)} type="button">
            <div className="flex items-center justify-center gap-2 bg-neutral-600 rounded-sm px-2 py-0.5 max-w-[120px] ">
              <span className="text-xs truncate leading-none align-middle">
                {item.label}
              </span>
              <div onClick={handleRemove(item)} className="flex items-center">
                <Icon
                  name="X"
                  color="currentColor"
                  size="md"
                  className="min-w-3 min-h-4"
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {value.length > maxBadgesDisplayed && (
        <span className="text-sm text-neutral-400 whitespace-nowrap">
          +{value.length - maxBadgesDisplayed} more
        </span>
      )}
    </div>
  );
};
