import { ReactNode, useMemo, useState, useRef, useLayoutEffect } from "react";

import { Badge } from "@components/Badge/Badge";
import { Icon } from "@/components/Icon/Icon";
import { cn } from "@/utils/index";

import { Selectable } from "@typings/Selectable";
import {
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui";
import { Button } from "@components/ui";
import { VirtualList } from "../VirtualList";

export interface BadgeMultiSelectProps {
  placeholder: ReactNode;
  alwaysShowPlaceholder?: boolean;
  options: Selectable[];
  className?: string;
  leftSideAddornment?: React.ReactNode;
  deprecated?: boolean;
  value: Selectable["value"][] | undefined;
  variant?: "tagSelector" | "triggerOnly" | "fullWidth";
  hasRemoveAction?: boolean;
  testId?: string;
  disablePortal?: boolean;
  handleReset?: () => void;
  handleSelectAll?: () => void;
  handleDeselectAll?: () => void;
  onChange: (value: Selectable["value"][]) => void;
  onRemoveActionClick?: () => void;
  maxBadges?: number;
  isResetOnRemove?: boolean;
}

export const BadgeMultiSelect = ({
  placeholder,
  options,
  value = [],
  alwaysShowPlaceholder,
  variant = "tagSelector",
  hasRemoveAction = false,
  deprecated,
  testId,
  disablePortal = false,
  isResetOnRemove = true,
  onRemoveActionClick,
  onChange,
  handleReset,
  handleSelectAll,
  handleDeselectAll,
  maxBadges = 3,
}: BadgeMultiSelectProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const handleValueChange = (selectedValue: Selectable["value"]) => {
    const updatedValues = value.some((v) => String(v) === String(selectedValue))
      ? value.filter((v) => String(v) !== String(selectedValue))
      : [...value, selectedValue];
    onChange(updatedValues);
  };

  const handleTagRemove = (itemToRemove: Selectable["value"]) => {
    if (Array.isArray(value)) {
      const updatedValues = value.filter(
        (item) => String(item) !== String(itemToRemove)
      );
      onChange(updatedValues);
    }
  };

  const handleResetFilters = () => {
    if (handleReset) {
      handleReset();
    } else {
      onChange([]);
    }
  };

  const renderSelectContent = () => {
    if (alwaysShowPlaceholder) return placeholder;
    return undefined;
  };

  const filteredOptions = useMemo(() => {
    return options
      .filter((option) =>
        String(option.value).toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((option) => ({
        ...option,
        checked: value?.some((v) => String(v) === String(option.value)),
      }));
  }, [options, value, searchQuery]);

  const getBadgesData = () => {
    return Array.isArray(value) && value.length > 0
      ? value.map((item) => {
          const option = options.find((option) => option.value === item);
          return {
            value: item,
            label: option ? option.label : item,
            deprecated: option?.deprecated,
          };
        })
      : [];
  };

  return (
    <div
      ref={containerRef}
      className={cn(variant === "fullWidth" && "relative")}
    >
      <Popover>
        <div
          className={cn(
            "flex items-center rounded-lg border",
            variant === "tagSelector" && getBadgesData().length > 0 && "pr-3",
            variant === "triggerOnly" && "border-none"
          )}
        >
          <Tooltip>
            <PopoverTrigger asChild disabled={deprecated} data-testid={testId}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-lg text-[#B3B3B3] p-2 hover:bg-transparent hover:text-[#B3B3B3] flex items-end gap-2 shrink-0",
                    deprecated && "opacity-50",
                    variant === "triggerOnly" &&
                      "border border-input flex items-center justify-center"
                  )}
                >
                  <span className="font-medium">{renderSelectContent()}</span>
                  {variant !== "triggerOnly" && (
                    <Icon name="ChevronDown" color="#FAFAFA" size="lg" />
                  )}
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            {deprecated && (
              <TooltipContent
                side="top"
                className="w-fit min-w-[150px] rounded-xl bg-neutral-800 shadow-2xl backdrop-blur-md flex items-center justify-between gap-2 p-2"
              >
                <span className="text-sm text-neutral-100">
                  This option is deprecated!
                </span>
                <Button
                  variant="destructive"
                  className="max-h-[25px]"
                  onClick={onRemoveActionClick}
                >
                  Remove Filter
                </Button>
              </TooltipContent>
            )}
          </Tooltip>
          {(variant === "tagSelector" || variant === "fullWidth") && (
            <div className="flex h-full items-center gap-2 flex-1">
              {getBadgesData().length > 0 && (
                <div className="min-h-[18px] w-px bg-neutral-600" />
              )}
              <div className="flex gap-2">
                {getBadgesData().length <= maxBadges ? (
                  <>
                    {getBadgesData().map(({ value, label }) => (
                      <button
                        onClick={() => handleTagRemove(value)}
                        key={String(value)}
                        disabled={deprecated}
                        data-testid={`${testId}-badge-${String(value)
                          .trim()
                          .replace(/ /g, "-")}`}
                      >
                        <Badge
                          text={String(label)}
                          className={{
                            wrapper: cn(
                              "max-h-[21px] items-start rounded-sm bg-neutral-600 py-0 ",
                              deprecated && "opacity-50"
                            ),
                            text: "",
                          }}
                          rightItem={{
                            name: "X",
                            size: "sm",
                            color: "currentColor",
                          }}
                        />
                      </button>
                    ))}
                  </>
                ) : (
                  <span
                    data-testid={`${testId}-badge-count`}
                    className="w-fit whitespace-nowrap block max-h-[21px] items-start rounded-sm border border-transparent bg-neutral-600 px-2.5 py-0 pl-2 text-xs font-semibold text-secondary-foreground shadow-xl transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {getBadgesData().length} / {options.length}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <PopoverContent
          className={cn(
            "z-[100000] rounded-md bg-[var(--neutral-900)] text-white shadow-md p-0",
            variant === "fullWidth" ? "absolute left-0" : "w-64"
          )}
          style={
            variant === "fullWidth"
              ? { width: containerWidth ? `${containerWidth}px` : "auto" }
              : undefined
          }
          align={variant === "fullWidth" ? "start" : "center"}
          sideOffset={0}
          disablePortal={disablePortal}
          onWheel={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col">
            {(getBadgesData().length > 0 ||
              ((handleDeselectAll || handleSelectAll) && options.length > 0)) &&
              (isResetOnRemove || handleDeselectAll || handleSelectAll) && (
                <div className="border-b border-neutral-700 p-1">
                  {isResetOnRemove && (
                    <Button
                      onClick={handleResetFilters}
                      variant="ghost"
                      className="mb-1 flex w-full items-center justify-start gap-2 pl-3 text-left"
                    >
                      <Icon name="RefreshCcw" color="#FAFAFA" size="lg" />
                      <span className="leading-none">Reset Filter</span>
                    </Button>
                  )}
                  {handleSelectAll &&
                    getBadgesData().length < options.length && (
                      <Button
                        onClick={handleSelectAll}
                        variant="ghost"
                        className="mb-1 flex w-full items-center justify-start gap-2 pl-3 text-left"
                        data-testid={
                          testId ? `${testId}-select-all` : undefined
                        }
                      >
                        <Icon name="CheckCheck" color="#FAFAFA" size="lg" />
                        <span className="leading-none">Select All</span>
                      </Button>
                    )}
                  {handleDeselectAll && getBadgesData().length > 0 && (
                    <Button
                      onClick={handleDeselectAll}
                      variant="ghost"
                      className="mb-1 flex w-full items-center justify-start gap-2 pl-3 text-left"
                      data-testid={
                        testId ? `${testId}-deselect-all` : undefined
                      }
                    >
                      <Icon name="X" color="#FAFAFA" size="lg" />
                      <span className="leading-none">Deselect All</span>
                    </Button>
                  )}
                </div>
              )}

            <div className="flex border-b border-neutral-700 p-0">
              <div className="flex items-center gap-1 px-3 py-1">
                <Icon name="Search" color="#A3A3A3" size="lg" />
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-0 border-none bg-[var(--neutral-900)] pt-1 text-white focus-within:ring-0 focus-within:!ring-offset-0"
                />
              </div>
            </div>
            <div className="p-1">
              <VirtualList maxHeight={200} items={filteredOptions}>
                {(item) => (
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        key={String(item.value)}
                        asChild
                        variant="ghost"
                        onClick={() => handleValueChange(item.value)}
                        data-testid={String(item.value)}
                        className={cn(
                          "flex h-auto w-full items-center justify-start gap-3 pl-2 text-left",
                          item.deprecated && "opacity-50"
                        )}
                      >
                        <div>
                          <Checkbox checked={item.checked} />
                          <span className="w-full whitespace-normal">
                            {item.label}
                          </span>
                          {item.deprecated && (
                            <Icon name="Info" color="#FAFAFA" size="lg" />
                          )}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    {item.deprecated && (
                      <TooltipContent
                        side="top"
                        className="flex w-fit min-w-[150px] items-center justify-between gap-2 rounded-xl bg-neutral-800 p-2 text-neutral-100 shadow-2xl"
                      >
                        <span className="text-sm">
                          This option is deprecated
                        </span>
                      </TooltipContent>
                    )}
                  </Tooltip>
                )}
              </VirtualList>
            </div>
            {hasRemoveAction && (
              <div
                className={`w-full p-1 ${
                  filteredOptions.length > 0
                    ? "border-t border-neutral-700"
                    : ""
                }`}
              >
                <Button
                  variant="ghost"
                  onClick={onRemoveActionClick}
                  className="mb-1 flex w-full items-center justify-start gap-2 pl-2 text-left"
                >
                  <Icon name="X" color="#FAFAFA" size="lg" />
                  <span>Remove Filter</span>
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
