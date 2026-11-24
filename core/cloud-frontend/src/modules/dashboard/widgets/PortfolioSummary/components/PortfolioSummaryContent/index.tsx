import { concat } from "ramda";
import { useCallback, useMemo, useRef, useState } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useSelection } from "@hooks/useSelection";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { BadgeMultiSelect } from "@components/BadgeMultiSelect";
import { TextSelect } from "@/components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { Selectable } from "@typings/Selectable";
import { createMetricOptions } from "@/utils/metricOptions";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui";

import { WidgetActions } from "@/components/Widget/WidgetActions";
import { WidgetBody } from "@/components/Widget/WidgetBody";
import { WidgetHeader } from "@/components/Widget/WidgetHeader";
import WidgetMaximizeButton from "@/components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "@/components/Widget/WidgetTitle";
import { WidgetWrapper } from "@/components/Widget/WidgetWrapper";
import { PortfolioSummaryTable } from "../PortfolioSummaryTable";
import { usePortfolioSummary } from "../../hooks/usePortfolioSummary";
import { usePortfolioSummaryTable } from "../../hooks/usePortfolioSummaryTable";
import { getFilterOptions } from "@/components/FilterController/utils";
import { MetricMetadata } from "@api/types";
import { Icon } from "@/components/Icon/Icon";
import { Filters } from "@/typings/Filters";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useDateRange } from "@/providers/DateRangeProvider";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { GridApi } from "@ag-grid-community/core";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { SearchField } from "../../../CoverageUniverse/components/SearchField";
import { useDebounceCallback } from "@/hooks/useDebouncedCallback";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";

export interface IPortfolioSummarySelection {
  groupBy: string;
  metrics: string[];
}

export interface PortfolioSummaryTableProps {
  metrics: string[];
  groupByMetrics: string[];
  defaultMetrics: string[];
  defaultGroupByMetric: string;
  defaultSubgroupBy: string;
  defaultSubgroupByFallback: string;
  defaultSortByMetric: string;
  defaultSortDirection: "asc" | "desc";
  defaultFilters?: Filters;
  groupingLevelsConfigExplodeOff?: string[];
  groupingLevelsConfigExplodeOn?: string[];
}

const explodeCompositeAdditionalMetrics = ["whale_minnow_tag"];

export const PortfolioSummaryContent = ({
  metrics: metricsProp,
  groupByMetrics,
  defaultMetrics: defaultMetricsProp,
  defaultGroupByMetric,
  defaultSubgroupBy,
  defaultSubgroupByFallback,
  defaultSortByMetric,
  defaultSortDirection,
  defaultFilters,
  groupingLevelsConfigExplodeOff,
  groupingLevelsConfigExplodeOn,
}: PortfolioSummaryTableProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { account } = useAuth();

  const [showMyCoverageOnly, setShowMyCoverageOnly] = useState<boolean>(false);

  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQueryValue, _setSearchQueryValue] = useState(searchInputValue);

  const setSearchQueryValue = useDebounceCallback(_setSearchQueryValue, 500);

  const setSearchValue = useCallback(
    (value: string) => {
      setSearchInputValue(value);
      setSearchQueryValue(value);
    },
    [setSearchQueryValue]
  );

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { startDate, endDate } = useDateRange();

  const metrics = useMemo(
    () =>
      concat(
        metricsProp,
        metricFlags.explode_composites ? explodeCompositeAdditionalMetrics : []
      ),
    [metricsProp, metricFlags.explode_composites]
  );

  const defaultMetrics = useMemo(
    () =>
      concat(
        defaultMetricsProp,
        metricFlags.explode_composites ? explodeCompositeAdditionalMetrics : []
      ),
    [defaultMetricsProp, metricFlags.explode_composites]
  );

  const { selection, handleSelectionChange, handleSelectionReset } =
    useSelection<IPortfolioSummarySelection>({
      groupBy: defaultGroupByMetric,
      metrics: defaultMetrics ?? [],
    });

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const filterOptions = useMemo(() => {
    return getFilterOptions(metricsCatalogData as MetricMetadata);
  }, [metricsCatalogData]);

  const metricsCatalogUnfiltered = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const metricsCatalog = useMemo(
    () =>
      metricsCatalogUnfiltered.filter((metric) =>
        metrics.includes(metric.name)
      ),
    [metricsCatalogUnfiltered, metrics]
  );

  const groupingLevelsConfig = metricFlags.explode_composites
    ? (groupingLevelsConfigExplodeOn ?? [])
    : (groupingLevelsConfigExplodeOff ?? []);

  const {
    portfolioMetricsData,
    isLoadingPortfolioSummary,
    refetchPortfolioSummary,
    isLoadingPortfolioSummaryInvalidate,
    invalidateCache,
  } = usePortfolioSummary({
    startDate: panelStartDate ?? startDate,
    endDate: panelEndDate ?? endDate,
    groupBy: selection.groupBy,
    defaultSubgroupBy,
    defaultSubgroupByFallback,
    metricFlags,
    metricsCatalog,
    sharedFilters,
    groupingLevelsConfig,
  });

  const { columnsOrder, formatedData } = usePortfolioSummaryTable({
    search: searchQueryValue,
    metrics: selection.metrics,
    groupBy: selection.groupBy,
    metricFlags,
    portfolioMetricsData,
    defaultSubgroupBy,
    defaultSubgroupByFallback,
    groupingLevelsConfig,
    explodeCompositeAdditionalMetrics,
  });

  const filteredData = useMemo(() => {
    if (!showMyCoverageOnly || !account?.email) {
      return formatedData;
    }

    const userEmail = account.email;

    return formatedData.filter((item: Record<string, unknown>) => {
      const checkAnalyst = (field: unknown): boolean => {
        if (typeof field === "string") {
          return field.split(",").some((avatar) => {
            const email = avatar.trim().split("|")[0];
            return email === userEmail;
          });
        }
        return false;
      };

      return (
        checkAnalyst(item.primary_analyst_avatars) ||
        checkAnalyst(item.primary_analyst_avatar) ||
        checkAnalyst(item.secondary_analyst_avatars)
      );
    });
  }, [formatedData, showMyCoverageOnly, account?.email]);

  const handleMyCoverageToggle = useCallback((value: boolean) => {
    setShowMyCoverageOnly(value);
  }, []);

  const groupByFieldName = useMemo(
    () =>
      metricsCatalogUnfiltered.find((item) => item.name === selection.groupBy)
        ?.display_name,
    [metricsCatalogUnfiltered, selection.groupBy]
  );

  const groupByFieldDescription = useMemo(
    () =>
      metricsCatalogUnfiltered.find((item) => item.name === selection.groupBy)
        ?.description,
    [metricsCatalogUnfiltered, selection.groupBy]
  );

  const metricsOptions: Selectable[] = useMemo(
    () =>
      metricsCatalog.map((metric) => ({
        value: metric.name,
        label: metric.display_name,
      })),
    [metricsCatalog]
  );

  const groupByOptions = useMemo(
    () => createMetricOptions(groupByMetrics, metricsCatalogUnfiltered),
    [groupByMetrics, metricsCatalogUnfiltered]
  );

  const isLoading = useMemo(
    () => isLoadingCatalog || isLoadingPortfolioSummary,
    [isLoadingCatalog, isLoadingPortfolioSummary]
  );

  const exportToCSV = useCallback(
    (name: string) =>
      exportDatagridToCSV(gridRef, name, [
        metricsCatalogData?.metrics?.find(
          (metric) => metric.name === selection.groupBy
        )?.display_name || "",
        "Instrument Name",
        "Position Instrument Name",
      ]),
    [selection.groupBy, metricsCatalogData]
  );

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetchPortfolioSummary();
  }, [invalidateCache, refetchPortfolioSummary]);

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle {...{ exportToCSV }}>Portfolio Summary</WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={
              isLoadingPortfolioSummaryInvalidate || isLoadingCatalog
            }
          />
          <SkeletonWrapper
            isLoading={isLoadingCatalog}
            skeletonClassName="w-[128px] h-9"
          >
            <TextSelect
              virtual
              disablePortal
              options={groupByOptions}
              value={selection.groupBy}
              placeholder="Aggregate By"
              onChange={handleSelectionChange("groupBy")}
              testId="portfolio-summary-group-by-select"
            />
          </SkeletonWrapper>

          <SkeletonWrapper
            isLoading={isLoadingCatalog}
            skeletonClassName="size-9"
          >
            <BadgeMultiSelect
              disablePortal
              options={metricsOptions}
              value={selection.metrics}
              alwaysShowPlaceholder
              variant="triggerOnly"
              testId="portfolio-summary-metrics-select"
              placeholder={<Icon name="Columns3" color="#ffffff" size="lg" />}
              handleReset={handleSelectionReset("metrics")}
              onChange={handleSelectionChange("metrics")}
            />
          </SkeletonWrapper>

          <WidgetMaximizeButton />
        </WidgetActions>
      </WidgetHeader>

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <SearchField
            value={searchInputValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          <FilterController
            filterOptions={filterOptions}
            selectedFilters={filters}
            defaultFilters={defaultFilters}
            isLoadingMetricsCatalog={isLoadingCatalog}
            setSelectedFilters={setFilters}
            disableSubFilterPortal
            testId="portfolio-summary-filter-controller"
          />
        </div>

        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <Label
            htmlFor="my-coverage-only"
            className="text-sm font-normal text-muted-foreground whitespace-nowrap"
          >
            My Coverage Only
          </Label>
          <Switch
            data-testid="portfolio-summary-my-coverage-switch"
            id="my-coverage-only"
            className="scale-90"
            checked={showMyCoverageOnly}
            onCheckedChange={handleMyCoverageToggle}
          />
        </div>
      </div>

      <WidgetBody data-testid="portfolio-summary-table-body">
        <PortfolioSummaryTable
          gridRef={gridRef}
          isLoading={isLoading}
          rows={filteredData}
          metricsCatalog={metricsCatalog}
          columnsOrder={columnsOrder}
          groupByFieldName={groupByFieldName}
          groupByFieldDescription={groupByFieldDescription}
          defaultSortByMetric={defaultSortByMetric}
          defaultSortDirection={defaultSortDirection}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};
