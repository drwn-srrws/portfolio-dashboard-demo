import { FormControl, FormControlProps } from "@/components/Form/FormControl";
import { Icon } from "@/components/Icon/Icon";
import { Skeleton } from "@components/ui/skeleton";
import { cn } from "@/utils/utils";

import { Button } from "../ui";
import FilterPanel, { IFilterPanelProps } from "./components/FilterPanel";
import { forwardRef, useMemo } from "react";

export type FilterControllerProps = IFilterPanelProps & {
  isLoadingMetricsCatalog?: boolean;
  showFilters?: boolean;
  className?: string;
  testId?: string;
  usePortal?: boolean;
  disableSubFilterPortal?: boolean;
} & FormControlProps;

const FilterController = forwardRef<HTMLDivElement, FilterControllerProps>(
  (
    {
      showFilters = true,
      isLoadingMetricsCatalog = false,
      selectedFilters,
      filterOptions,
      defaultFilters,
      setSelectedFilters,
      className,
      testId,
      usePortal = false,
      disableSubFilterPortal = false,
      ...props
    },
    ref
  ) => {
    const filterOptionsWithValues = useMemo(
      () =>
        filterOptions?.filter((option) => option.filterable_values !== null) ||
        [],
      [filterOptions]
    );

    return (
      <FormControl {...props}>
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-between gap-3 transition-all duration-300 ease-in-out",
            showFilters ? "max-h-screen" : "max-h-0 overflow-hidden",
            className
          )}
        >
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {isLoadingMetricsCatalog ? (
              <div className="flex w-[300px] justify-center gap-3">
                <Skeleton className="h-9 w-[full] flex-1" />
                <Skeleton className="h-9 w-[full] flex-1" />
                <Skeleton className="h-9 w-[full] flex-1" />
                <Skeleton className="h-9 w-[full] flex-1" />
              </div>
            ) : (
              <>
                <FilterPanel
                  defaultFilters={defaultFilters}
                  filterOptions={filterOptionsWithValues}
                  selectedFilters={selectedFilters || []}
                  setSelectedFilters={setSelectedFilters}
                  testId={testId}
                  usePortal={usePortal}
                  disableSubFilterPortal={disableSubFilterPortal}
                />
                <Button
                  onClick={() => {
                    setSelectedFilters({});
                  }}
                  variant="ghost"
                  className="shrink-0 gap-2 text-neutral-400 hover:bg-transparent"
                  data-testid={`${testId}-clear-filters`}
                >
                  <Icon name="X" size="lg" color="#a3a3a3" />
                  <span>Clear Filters</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </FormControl>
    );
  }
);

export default FilterController;
