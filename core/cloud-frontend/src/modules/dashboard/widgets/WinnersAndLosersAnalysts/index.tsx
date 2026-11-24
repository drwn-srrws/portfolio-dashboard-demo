import { useCallback, useMemo, useRef } from "react";
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
import { WinnersAndLosersAnalystsTable } from "./components/WinnersAndLosersTable";
import { useWinnersAndLosersAnalysts } from "./hooks/useWinnersAndLosersAnalysts";
import { usePanel } from "@/providers/PanelProvider";
import { Filters } from "@/typings/Filters";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { exportMultipleDatagridsToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { GridApi } from "@ag-grid-community/core";
import { DATE_RANGE_OPTIONS } from "./components/WinnersAndLosersTable/WinnersAndLosersAnalystsTable.utils";
import { useResolvedDates } from "./hooks/useResolvedDates";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";

export interface WinnersAndLosersAnalystsSelection {
  top: string;
  analystType: "primary_analyst" | "secondary_analyst";
}

export interface WinnersAndLosersAnalystsTableProps {
  disableFilters?: boolean;
  groupByTop: string[];
  sortByMetric: string;
  defaultFilters?: Filters;
  showFilters?: boolean;
  metrics?: string[];
  showDateRangeSelect?: boolean;
  showTopSelect?: boolean;
  showAnalystTypeSelect?: boolean;
}

const WinnersAndLosersAnalystsContent = ({
  disableFilters,
  groupByTop,
  sortByMetric,
  defaultFilters,
  showFilters = true,
  metrics,
  showDateRangeSelect = false,
  showTopSelect = true,
  showAnalystTypeSelect = false,
}: WinnersAndLosersAnalystsTableProps) => {
  const gridRefWinners = useRef<GridApi | null>(null);
  const gridRefLosers = useRef<GridApi | null>(null);
  const dockViewPanelProps = usePanel();

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();

  const { startDate, endDate, datePeriod, handleDatePeriodChange } =
    useResolvedDates(showDateRangeSelect);

  const { selection, handleSelectionChange } =
    useSelection<WinnersAndLosersAnalystsSelection>({
      top: groupByTop[1],
      analystType: "primary_analyst",
    });

  const {
    isLoadingCatalog,
    isLoading,
    winnersRowsAnalysts,
    losersRowsAnalysts,
    metricsCatalogUnfiltered,
    filterOptions,
    isLoadingWinnersAndLosersInvalidate,
    refetchWinnersAndLosers,
    invalidateCache,
  } = useWinnersAndLosersAnalysts({
    selection,
    startDate,
    endDate,
    metricFlags,
    filters: !disableFilters ? sharedFilters : {},
    sortByMetric,
    metrics,
    analystType: selection.analystType,
  });
  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetchWinnersAndLosers();
  }, [invalidateCache, refetchWinnersAndLosers]);

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

  const analystTypeOptions = useMemo(
    () =>
      createMetricOptions(
        ["primary_analyst", "secondary_analyst"],
        metricsCatalogUnfiltered
      ),
    [metricsCatalogUnfiltered]
  );

  return (
    <WidgetWrapper data-testid="winners-losers-analysts-widget">
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
          Top Winners & Losers (Analysts)
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
                testId="winners-losers-analysts-date-range-select"
              />
            </SkeletonWrapper>
          )}

          {showAnalystTypeSelect && (
            <SkeletonWrapper
              isLoading={isLoadingCatalog}
              skeletonClassName="w-[128px] h-9"
            >
              <TextSelect
                disablePortal
                virtual
                options={analystTypeOptions}
                value={selection.analystType}
                placeholder="Analyst Type"
                onChange={handleSelectionChange("analystType")}
                testId="winners-losers-analysts-type-select"
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
                testId="winners-losers-analysts-top-select"
              />
            </SkeletonWrapper>
          )}
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={
              isLoadingWinnersAndLosersInvalidate || isLoadingCatalog
            }
          />
          <WidgetMaximizeButton id="winners-and-losers-analysts-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      {showFilters && (
        <FilterController
          testId="winners-losers-analysts-filter-controller"
          filterOptions={filterOptions}
          selectedFilters={filters}
          defaultFilters={defaultFilters}
          setSelectedFilters={setFilters}
          isLoadingMetricsCatalog={isLoadingCatalog}
          disableSubFilterPortal
        />
      )}

      <WidgetBody
        data-testid={`winners-losers-analysts-table-body-${dockViewPanelProps?.api.id}`}
      >
        <WinnersAndLosersAnalystsTable
          gridRefWinners={gridRefWinners}
          gridRefLosers={gridRefLosers}
          isLoading={isLoading}
          winersRows={winnersRowsAnalysts}
          losersRows={losersRowsAnalysts}
          sortByMetric={sortByMetric}
          metricsCatalog={metricsCatalogUnfiltered}
          analystType={selection.analystType}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const WinnersAndLosersAnalysts = withAppInsights(
  WinnersAndLosersAnalystsContent,
  "WinnersAndLosersAnalysts"
);
