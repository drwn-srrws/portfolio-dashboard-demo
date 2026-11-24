import { useVirtualizer } from "@tanstack/react-virtual";
import { ReactNode, useRef } from "react";

import { cn } from "@/utils/utils";
import { Icon } from "../Icon/Icon";

export const DEFAULT_VIRTUAL_LIST_ESTIMATE_SIZE = 35;
export const DEFAULT_VIRTUAL_LIST_MAX_HEIGHT = 288;

export interface VirtualListProps<T> {
  asChild?: boolean;
  items: T[];
  className?: string;
  estimateSize?: number;
  maxHeight?: number;
  testId?: string;
  isLoading?: boolean;
  children?: (item: T) => ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const VirtualList = <T,>({
  className,
  items,
  estimateSize = DEFAULT_VIRTUAL_LIST_ESTIMATE_SIZE,
  maxHeight = DEFAULT_VIRTUAL_LIST_MAX_HEIGHT,
  isLoading = false,
  testId = "virtual-list-container",
  children,
  onScroll,
}: VirtualListProps<T>) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  const totalHeight = rowVirtualizer.getTotalSize();
  const containerHeight = Math.min(totalHeight, maxHeight);

  return (
    <div
      ref={parentRef}
      className={cn("overflow-y-auto contain-strict", className)}
      data-testid={testId}
      style={{ height: `${containerHeight}px` }}
      onScroll={onScroll}
    >
      <div className="relative w-full" style={{ height: `${totalHeight}px` }}>
        <div
          className="absolute left-0 top-0 w-full"
          style={{ transform: `translateY(${virtualItems[0]?.start}px)` }}
        >
          {virtualItems.map((virtualItem) => (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement}
            >
              {children?.(items[virtualItem.index])}
            </div>
          ))}
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
        </div>
      </div>
    </div>
  );
};
