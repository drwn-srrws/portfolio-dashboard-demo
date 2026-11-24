import { useEffect, useMemo } from "react";

import {
  CompanyCatalogRequestFilters,
  CompanyLogicalFilterFiltersItem,
  CompanySort,
  LogicalOperator,
} from "@/api/types";
import FilterController from "@/components/FilterController/FilterController";
import { InfiniteMultiSelect } from "@/components/InfiniteMultiSelect/InfiniteMultiSelect";
import { TextSelect } from "@/components/TextSelect";
import {
  WidgetActions,
  WidgetBody,
  WidgetHeader,
  WidgetMaximizeButton,
  WidgetTitle,
  WidgetWrapper,
} from "@/components/Widget";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { useSelection } from "@/hooks/useSelection";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useInfiniteCompanies } from "@/modules/dashboard/widgets/RealTimeTickerPriceChart/hooks/useInfiniteCompanies";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import { Selectable } from "@/typings/Selectable";
import { cn } from "@/utils";
import { Skeleton } from "@components/ui/skeleton";
import { mapFiltersToCompanyFilters } from "../../../CoverageUniverse/helpers/filters";
import {
  DATE_RANGE_OPTIONS,
  DateRange,
  METRIC_TYPE_OPTIONS,
  MetricType,
} from "./constants";
import { useChartCompanies } from "../../hooks/useChartCompanies";
import { useDefaultChartCompanies } from "../../hooks/useDefaultChartCompanies";
import { TimeSeriesChart } from "../TimeSeriesChart/TimeSeriesChart";

export interface PerfomanceOverviewChartSelection {
  selectedGroupBy: string;
  selectedDisplayValue: string;
}

export interface PerfomanceOverviewChartProps {
  defaultFilters: CompanyCatalogRequestFilters[];
  showFilters?: boolean;
}

export type PriceChartSelection = {
  selectedDateRange: DateRange;
  selectedMetricType: MetricType;
  selectedCompanies: Selectable[];
};

const sortByMetric = CompanySort.ytd_percent_return_bbg;

export const TimeSeriesChartContent = ({
  defaultFilters: defaultAdvancedFilter,
  showFilters,
}: PerfomanceOverviewChartProps) => {
  const {
    selection: { selectedDateRange, selectedMetricType, selectedCompanies },
    updateSelection,
  } = useSelection<PriceChartSelection>({
    selectedDateRange: "YTD",
    selectedMetricType: METRIC_TYPE_OPTIONS[0].value,
    selectedCompanies: [],
  });

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { isMaximized } = usePanelMaximize();

  const defaultFilters = useMemo(
    () =>
      (defaultAdvancedFilter && defaultAdvancedFilter.length > 0
        ? defaultAdvancedFilter.filter(Boolean)
        : []) as CompanyLogicalFilterFiltersItem[],
    [defaultAdvancedFilter]
  );

  const { defaultCompanies, isLoadingDefaultCompanies } =
    useDefaultChartCompanies({
      defaultFilters,
      sharedFilters,
      sortByMetric,
    });

  const {
    options,
    fetchNextPage,
    isFetchingNextPage,
    searchInputValue,
    debouncedSearchQuery,
    isLoading: isLoadingCompanies,
  } = useInfiniteCompanies({
    page: 1,
    page_size: 20,
    sort_by: sortByMetric,
    sort_order: "desc",
    filter: {
      op: LogicalOperator.and,
      filters: [
        ...defaultFilters,
        ...(sharedFilters ? mapFiltersToCompanyFilters(sharedFilters) : []),
      ],
    },
  });

  const {
    filterOptions,
    isPlaceholderData,
    isLoadingCompanyData,
    isLoadingCatalogData,
    companiesData,
  } = useChartCompanies({
    defaultFilters,
    sharedFilters,
    selectedDateRange,
    selectedMetricType,
    selectedCompanies,
  });

  useEffect(() => {
    if (defaultCompanies) {
      const companies: Selectable[] = defaultCompanies.map((company) => ({
        label: company.name || "",
        value: company.id.toString(),
      }));

      updateSelection("selectedCompanies", companies);
    }
  }, [defaultCompanies, updateSelection]);

  const isLoadingOptions = useMemo(() => {
    return (isFetchingNextPage && !options?.length) || isLoadingCompanies;
  }, [isFetchingNextPage, options, isLoadingCompanies]);

  return (
    <WidgetWrapper testId="performance-overview-widget">
      <WidgetHeader>
        <WidgetTitle>Price Timeseries</WidgetTitle>
        <WidgetActions>
          <div className="w-[140px]">
            <TextSelect
              options={METRIC_TYPE_OPTIONS}
              value={selectedMetricType}
              onChange={(value) =>
                updateSelection("selectedMetricType", value as MetricType)
              }
            />
          </div>
          <div className="w-[120px]">
            <TextSelect
              options={DATE_RANGE_OPTIONS}
              value={selectedDateRange}
              onChange={(value) =>
                updateSelection("selectedDateRange", value as DateRange)
              }
            />
          </div>
          <div className="w-[195px]">
            {isLoadingDefaultCompanies ? (
              <Skeleton className="size-full w-full h-[22.5px]" />
            ) : (
              <InfiniteMultiSelect
                disableFiltering={true}
                value={selectedCompanies}
                onChange={(value) =>
                  updateSelection("selectedCompanies", value)
                }
                onSearchChange={debouncedSearchQuery}
                search={searchInputValue}
                options={options}
                placeholder="Select Company"
                isLoadingMore={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                maxBadgesDisplayed={1}
                isLoadingOptions={isLoadingOptions}
              />
            )}
          </div>
          <WidgetMaximizeButton id="performance-overview-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        filterOptions={filterOptions}
        selectedFilters={filters}
        isLoadingMetricsCatalog={isLoadingCatalogData}
        testId="performance-overview-filter-controller"
        setSelectedFilters={setFilters}
        disableSubFilterPortal
        showFilters={showFilters}
      />

      <WidgetBody data-testid="performance-overview-table-body">
        <div className={cn("h-96 md:h-full", isMaximized && "h-full")}>
          <TimeSeriesChart
            companiesData={companiesData}
            pending={isPlaceholderData}
            loading={isLoadingCompanyData || isLoadingDefaultCompanies}
            selectedDateRange={selectedDateRange}
            selectedMetricType={selectedMetricType}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};
