import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Icon } from "@/components/Icon/Icon";
import { cn } from "@/utils/index";

import { Selectable } from "@typings/Selectable";
import {
  Button,
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipTrigger,
} from "@components/ui";
import { VirtualList } from "@/components/VirtualList";
import { FormControl, FormControlProps } from "@/components/Form/FormControl";
import { BadgePicker } from "./BadgePicker";

export interface InfiniteMultiSelectProps
  extends Omit<FormControlProps, "value" | "onChange"> {
  disableFiltering?: boolean;
  value?: Selectable[];
  placeholder: ReactNode;
  options: Selectable[];
  isLoadingOptions?: boolean;
  isLoadingMore?: boolean;
  required?: boolean;
  search?: string;
  disabled?: boolean;
  testId?: string;
  maxBadgesDisplayed?: number;
  onChange?: (value: Selectable[]) => void;
  onSearchChange?: (value: string) => void;
  onLoadMore?: () => void;
}

export const InfiniteMultiSelect = ({
  disableFiltering,
  placeholder = "Select",
  options,
  isLoadingOptions,
  isLoadingMore,
  required,
  value = [],
  testId,
  search: propSearch,
  disabled,
  onChange,
  onLoadMore,
  onSearchChange,
  ...props
}: InfiniteMultiSelectProps) => {
  const [_search, _setSearch] = useState("");
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = propSearch ?? _search;
  const filteredOptions = useMemo(() => {
    if (disableFiltering) return options;

    return options.filter((option) =>
      option.label.toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search, disableFiltering]);
  const isChecked = useCallback(
    (option: Selectable) => value.some((item) => item.value === option.value),
    [value]
  );

  const setSearch = useCallback(
    (value: string) => {
      if (!propSearch) _setSearch(value);
      onSearchChange?.(value);
    },
    [onSearchChange, propSearch]
  );

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    [setSearch]
  );

  const handleValueChange = useCallback(
    (selectedValue: Selectable) => {
      onChange?.(
        value.some((item) => item.value === selectedValue.value)
          ? value.filter((item) => item.value !== selectedValue.value)
          : [...value, selectedValue]
      );
    },
    [onChange, value]
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

      if (scrollHeight - scrollTop <= clientHeight + 100) {
        onLoadMore?.();
      }
    },
    [onLoadMore]
  );

  const handleRemove = useCallback(
    (itemToRemove: Selectable) => {
      onChange?.(value.filter((item) => item.value !== itemToRemove.value));
    },
    [onChange, value]
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <FormControl {...props} required={required}>
        <Popover {...props}>
          <PopoverTrigger
            asChild
            data-testid={testId}
            disabled={disabled}
            className={cn(
              "flex items-center rounded-lg border border-neutral-800 relative py-2 pl-3 gap-2 pr-10 w-full cursor-pointer",
              disabled && "opacity-50"
            )}
          >
            <div>
              {!value.length ? (
                <span className="text-sm text-muted-foreground">
                  {placeholder}
                </span>
              ) : (
                <BadgePicker
                  value={value}
                  onRemove={handleRemove}
                  maxBadgesDisplayed={props.maxBadgesDisplayed}
                />
              )}

              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Icon name="ChevronDown" color="#FAFAFA" size="lg" />
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className={cn(
              "z-50 w-full rounded-md bg-neutral-950 text-white shadow-md p-0"
            )}
            style={{ width: containerWidth ? `${containerWidth}px` : "auto" }}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col w-full">
              <div className="flex border-b border-neutral-700 p-0">
                <div className="flex items-center gap-0 px-3 py-1 w-full">
                  <Icon name="Search" color="#A3A3A3" size="lg" />
                  <Input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={handleSearchChange}
                    className="mt-0 border-none bg-transparent p-2 text-white focus-within:ring-0 focus-within:!ring-offset-0 rounded-md py-3 text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="p-1">
                {isLoadingOptions ? (
                  <div className="flex items-center justify-center h-full p-5">
                    <Icon
                      name="Loader"
                      color="#A3A3A3"
                      size="lg"
                      className="animate-spin"
                    />
                  </div>
                ) : (
                  <VirtualList
                    items={filteredOptions}
                    maxHeight={200}
                    onScroll={handleScroll}
                    isLoading={isLoadingMore}
                  >
                    {(item) => (
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="w-full" asChild>
                          <Button
                            key={String(item.value)}
                            asChild
                            variant="ghost"
                            onClick={() => handleValueChange(item)}
                            data-testid={String(item.value)}
                            className={cn(
                              "flex h-auto w-full items-center justify-start gap-3 pl-2 text-left"
                            )}
                          >
                            <div>
                              <Checkbox
                                type="button"
                                checked={isChecked(item)}
                              />
                              <span className="w-full whitespace-normal">
                                {item.label}
                              </span>
                            </div>
                          </Button>
                        </TooltipTrigger>
                      </Tooltip>
                    )}
                  </VirtualList>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </FormControl>
    </div>
  );
};
