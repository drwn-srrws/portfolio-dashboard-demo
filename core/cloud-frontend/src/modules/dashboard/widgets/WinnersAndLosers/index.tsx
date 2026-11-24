import { useMemo, useRef, useState } from "react";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { TextSelect } from "@/components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { useSelection } from "@hooks/useSelection";
import { createMetricOptions } from "@/utils/metricOptions";
import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { WinnersAndLosersTable } from "./components/WinnersAndLosersTable";
import { useWinnersAndLosers } from "./hooks/useWinnersAndLosers";
import { usePanel } from "@/providers/PanelProvider";
import { Filters } from "@/typings/Filters";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { exportMultipleDatagridsToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { GridApi } from "@ag-grid-community/core";
import { DATE_RANGE_OPTIONS } from "./components/WinnersAndLosersTable/WinnersAndLosersTable.utils";
import { useResolvedDates } from "./hooks/useResolvedDates";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { useCallback } from "react";

export interface WinnersAndLosersSelection {
  groupBy: string;
  top: string;
}

export interface WinnersAndLosersTableProps {
  disableFilters?: boolean;
  groupByMetrics: string[];
  groupByTop: string[];
  sortByMetric: string;
  defaultGroupByMetric: string;
  defaultSubgroupBy: string;
  defaultSubgroupByFallback: string;
  defaultFilters?: Filters;
  showGroupBySelect: boolean;
  showFilters?: boolean;
  metrics?: string[];
  showDateRangeSelect?: boolean;
  showTopSelect?: boolean;
  showPrecisionSelect?: boolean;
  defaultPrecision?: number;
}

const WinnersAndLosersContent = ({
  disableFilters,
  groupByMetrics,
  groupByTop,
  sortByMetric,
  defaultGroupByMetric,
  defaultSubgroupBy,
  defaultFilters,
  defaultSubgroupByFallback,
  showGroupBySelect,
  showFilters = true,
  metrics,
  showDateRangeSelect = false,
  showTopSelect = true,
  showPrecisionSelect = false,
  defaultPrecision = 2,
}: WinnersAndLosersTableProps) => {
  const gridRefWinners = useRef<GridApi | null>(null);
  const gridRefLosers = useRef<GridApi | null>(null);
  const dockViewPanelProps = usePanel();

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();

  const { startDate, endDate, datePeriod, handleDatePeriodChange } =
    useResolvedDates(showDateRangeSelect);

  const { selection, handleSelectionChange } =
    useSelection<WinnersAndLosersSelection>({
      groupBy: defaultGroupByMetric,
      top: groupByTop[1],
    });

  const {
    isLoadingCatalog,
    isLoading,
    winersRows,
    losersRows,
    metricsCatalogUnfiltered,
    filterOptions,
    isLoadingWinnersAndLosersInvalidate,
    refetchWinnersAndLosers,
    invalidateCache,
  } = useWinnersAndLosers({
    selection,
    startDate,
    endDate,
    metricFlags,
    filters: !disableFilters ? sharedFilters : {},
    sortByMetric,
    defaultSubgroupBy,
    defaultSubgroupByFallback,
    metrics,
  });
  const groupByOptions = useMemo(
    () => createMetricOptions(groupByMetrics, metricsCatalogUnfiltered),
    [groupByMetrics, metricsCatalogUnfiltered]
  );

  const topOptions = useMemo(
    () => [
      { label: "Show All", value: "all" },
      ...groupByTop.map((option) => ({
        label: `Top ${option}`,
        value: option,
      })),
    ],
    [groupByTop]
  );

  const precisionOptions = useMemo(
    () =>
      ["2", "3"].map((option) => ({
        label: `${option} decimals`,
        value: option,
      })),
    []
  );

  const [precision, setPrecision] = useState<string>(
    String(defaultPrecision ?? 2)
  );

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetchWinnersAndLosers();
  }, [invalidateCache, refetchWinnersAndLosers]);

  return (
    <WidgetWrapper data-testid="winners-losers-widget">
      <WidgetHeader>
        <WidgetTitle
          exportToCSV={(name) => {
            exportMultipleDatagridsToCSV(
              gridRefWinners,
              gridRefLosers,
              name,
              "Winners",
              "Losers"
            );
          }}
        >
          Top Winners & Losers
        </WidgetTitle>
        <WidgetActions>
          {showDateRangeSelect && (
            <SkeletonWrapper
              isLoading={isLoadingCatalog}
              skeletonClassName="w-[160px] h-9"
            >
              <TextSelect
                disablePortal
                virtual
                options={DATE_RANGE_OPTIONS}
                value={datePeriod}
                placeholder="Date Range"
                onChange={handleDatePeriodChange}
                testId="winners-losers-date-range-select"
              />
            </SkeletonWrapper>
          )}

          {showGroupBySelect && (
            <SkeletonWrapper
              isLoading={isLoading}
              skeletonClassName="w-[128px] h-9"
            >
              <TextSelect
                disablePortal
                virtual
                options={groupByOptions}
                value={selection.groupBy}
                placeholder="Aggregate By"
                onChange={handleSelectionChange("groupBy")}
                testId="winners-losers-group-by-select"
              />
            </SkeletonWrapper>
          )}
          {showTopSelect && (
            <SkeletonWrapper
              isLoading={isLoadingCatalog}
              skeletonClassName="w-[128px] h-9"
            >
              <TextSelect
                disablePortal
                virtual
                options={topOptions}
                value={selection.top}
                placeholder="Select Top"
                onChange={handleSelectionChange("top")}
                testId="winners-losers-top-select"
              />
            </SkeletonWrapper>
          )}
          {showPrecisionSelect && (
            <SkeletonWrapper
              isLoading={isLoadingCatalog}
              skeletonClassName="w-[140px] h-9"
            >
              <TextSelect
                disablePortal
                virtual
                options={precisionOptions}
                value={precision}
                placeholder="Decimals"
                onChange={(value) => setPrecision(String(value))}
                testId="winners-losers-precision-select"
              />
            </SkeletonWrapper>
          )}
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={
              isLoadingWinnersAndLosersInvalidate || isLoadingCatalog
            }
          />
          <WidgetMaximizeButton id="winners-and-losers-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      {showFilters && (
        <FilterController
          testId="winners-losers-filter-controller"
          filterOptions={filterOptions}
          selectedFilters={filters}
          defaultFilters={defaultFilters}
          setSelectedFilters={setFilters}
          isLoadingMetricsCatalog={isLoadingCatalog}
          disableSubFilterPortal
        />
      )}

      <WidgetBody
        data-testid={`winners-losers-table-body-${dockViewPanelProps?.api.id}`}
      >
        <WinnersAndLosersTable
          gridRefWinners={gridRefWinners}
          gridRefLosers={gridRefLosers}
          isLoading={isLoading}
          winersRows={winersRows}
          losersRows={losersRows}
          groupBy={selection.groupBy}
          sortByMetric={sortByMetric}
          metricsCatalog={metricsCatalogUnfiltered}
          decimalPrecision={Number(precision)}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const WinnersAndLosers = withAppInsights(
  WinnersAndLosersContent,
  "WinnersAndLosers"
);
