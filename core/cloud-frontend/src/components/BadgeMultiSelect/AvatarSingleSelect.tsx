import React, {
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui";
import { Button, Input } from "@components/ui";
import { cn } from "@/utils/index";
import { UserResponse } from "@api/types/index";
import { Icon } from "../Icon/Icon";
import { Avatar } from "../Avatar";
import { SingleAvatar } from "./SingleAvatar";

export interface AvatarSingleSelectProps {
  options: (UserResponse & { disabled?: boolean })[];
  open?: boolean;
  value: UserResponse | null;
  placeholder?: React.ReactNode;
  searchable?: boolean;
  className?: string;
  search?: string;
  disableFiltering?: boolean;
  isLoadingMore?: boolean;
  isLoading?: boolean;
  bottomAdornment?: React.ReactNode;
  variant?: "fullWidth" | "containerWidth";
  avatarOnly?: boolean;
  onOpenChange?: (open: boolean) => void;
  onChange: (value: UserResponse | null) => void;
  testId?: string;
  onSearchChange?: (value: string) => void;
  onLoadMore?: () => void;
}

export const AvatarSingleSelect = ({
  options,
  open: propOpen,
  value = null,
  variant = "fullWidth",
  onChange,
  placeholder = "Select user",
  searchable = true,
  className,
  isLoadingMore,
  isLoading,
  search: propSearch,
  disableFiltering,
  bottomAdornment,
  avatarOnly = false,
  onSearchChange,
  onLoadMore,
  onOpenChange,
  testId,
}: AvatarSingleSelectProps) => {
  const [_search, _setSearch] = useState("");
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [_open, _setOpen] = useState(false);

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

  const handleSelect = (user: UserResponse) => {
    const newValue = value?.id === user.id ? null : user;
    onChange(newValue);
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

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <div className={cn("w-full", className)}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full rounded-lg text-[#B3B3B3] p-0 hover:bg-transparent hover:text-[#B3B3B3] flex justify-between items-center"
              )}
              data-testid={`${testId}-trigger-dropdown`}
            >
              {value ? (
                <div className="flex items-center gap-2">
                  <SingleAvatar data={value} />
                  {!avatarOnly && (
                    <span className="text-white">
                      {value.first_name} {value.last_name}
                    </span>
                  )}
                </div>
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
                    data-testid={`${testId}-search-input`}
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
                        variant={value?.id === user.id ? "secondary" : "ghost"}
                        className="flex w-full items-center gap-2 justify-start cursor-pointer"
                        onClick={() => handleSelect(user)}
                      >
                        <Avatar disableTooltip data={user} dense={true} />
                        <span className="whitespace-normal text-sm">
                          {user.first_name} {user.last_name}
                        </span>
                      </Button>
                    </div>
                  ))}

                {filteredOptions.length === 0 && !isLoading && (
                  <div className="flex items-center justify-center h-full p-2">
                    <span className="text-neutral-400">No results found</span>
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

export default AvatarSingleSelect;
