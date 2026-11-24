import React, {
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui";
import { Button, Checkbox, Input } from "@components/ui";
import { cn } from "@/utils/index";
import { UserResponse } from "@api/types/index";
import { Icon } from "../Icon/Icon";
import { Avatar } from "@components/Avatar";
import { Avatars } from "@components/Avatars";

export interface AvatarMultiSelectProps {
  open?: boolean;
  options: (UserResponse & { disabled?: boolean })[];
  value: UserResponse[];
  placeholder?: React.ReactNode;
  searchable?: boolean;
  className?: string;
  search?: string;
  disableFiltering?: boolean;
  isLoadingMore?: boolean;
  isLoading?: boolean;
  variant?: "fullWidth" | "containerWidth";
  bottomAdornment?: React.ReactNode;
  onChange: (value: UserResponse[]) => void;
  testId?: string;
  onOpenChange?: (open: boolean) => void;
  onSearchChange?: (value: string) => void;
  onLoadMore?: () => void;
}

export const AvatarMultiSelect = ({
  options,
  open: propOpen,
  value = [],
  onChange,
  placeholder = "Select users",
  searchable = true,
  className,
  isLoadingMore,
  isLoading,
  search: propSearch,
  disableFiltering,
  bottomAdornment,
  onOpenChange,
  testId,
  onSearchChange,
  onLoadMore,
  variant = "fullWidth",
}: AvatarMultiSelectProps) => {
  const [_search, _setSearch] = useState("");
  const [_open, _setOpen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = propSearch ?? _search;
  const open = propOpen ?? _open;

  const filteredOptions = useMemo(() => {
    if (disableFiltering) return options;
    return options.filter((user) =>
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [disableFiltering, options, search]);

  const handleToggle = (user: UserResponse) => {
    const updated = value.map((item) => item.email).includes(user.email)
      ? value.filter((item) => item.email !== user.email)
      : [...value, user];
    onChange(updated);
  };

  const setSearch = useCallback(
    (value: string) => {
      if (!propSearch) _setSearch(value);
      onSearchChange?.(value);
    },
    [onSearchChange, propSearch]
  );

  const setOpen = useCallback(
    (value: boolean) => {
      if (!propOpen) _setOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange, propOpen]
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

  const getSelectedData = () => {
    return value;
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <div className={cn("w-full", className)}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full rounded-lg  text-[#B3B3B3] p-0 hover:bg-transparent hover:text-[#B3B3B3] flex justify-between items-center"
              )}
              data-testid={`${testId}-trigger-dropdown`}
            >
              {getSelectedData().length > 0 ? (
                <Avatars
                  data={getSelectedData()}
                  maxVisibleAvatars={5}
                  testId={testId}
                />
              ) : (
                <span>{placeholder}</span>
              )}
              <Icon name="ChevronDown" color="#FAFAFA" size="lg" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "z-50 w-64 rounded-md bg-[var(--neutral-900)] text-white shadow-md p-0"
            )}
            style={{
              width: variant === "fullWidth" ? "auto" : containerWidth,
            }}
            onWheel={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col">
              {searchable && (
                <div className="flex items-center gap-2 px-3 py-1 border-b border-neutral-700">
                  <Icon name="Search" color="#A3A3A3" size="lg" />
                  <Input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mt-0 border-none bg-[var(--neutral-900)] p-2 text-white focus-within:ring-0 focus-within:!ring-offset-0"
                  />
                </div>
              )}
              <div
                className="max-h-[200px] overflow-y-auto p-1"
                onScroll={handleScroll}
                data-testid={`${testId}-virtual-list-container`}
              >
                {filteredOptions.length > 0 &&
                  !isLoading &&
                  filteredOptions.map((user) => (
                    <div
                      key={user.email}
                      className={cn({
                        "opacity-50": user?.disabled,
                        "pointer-events-none": user?.disabled,
                      })}
                    >
                      <Button
                        variant="ghost"
                        asChild
                        onClick={() => handleToggle(user)}
                        className="flex w-full items-center gap-2 justify-start cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={value
                              .map((item) => item.email)
                              .includes(user.email)}
                          />
                          <Avatar disableTooltip data={user} dense={true} />
                          <span
                            className="whitespace-normal text-sm"
                            data-testid={`${testId}-user-name`}
                          >
                            {user.first_name} {user.last_name}
                          </span>
                        </div>
                      </Button>
                    </div>
                  ))}

                {filteredOptions.length === 0 && !isLoading && (
                  <div className="flex items-center justify-center h-full p-2">
                    <span className="text-sm text-neutral-400">
                      No results found
                    </span>
                  </div>
                )}

                {isLoading && (
                  <div className="flex items-center justify-center h-full p-2">
                    <Icon
                      name="Loader"
                      color="#A3A3A3"
                      size="lg"
                      className="animate-spin"
                    />
                  </div>
                )}

                {isLoadingMore && (
                  <div className="flex items-center justify-center h-full p-2">
                    <Icon
                      name="Loader"
                      color="#A3A3A3"
                      size="lg"
                      className="animate-spin"
                    />
                  </div>
                )}
              </div>
              {bottomAdornment}
            </div>
          </PopoverContent>
        </div>
      </Popover>
    </div>
  );
};
