import { ColDef, GridApi } from "@ag-grid-community/core";
import { useMemo, useRef, useCallback } from "react";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { TextSelect } from "@/components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { MetricMetadata } from "@api/types/index";
import { getFilterOptions } from "@/components/FilterController/utils";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { usePanel } from "@/providers/PanelProvider";
import { Filters } from "@/typings/Filters";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { exportMultipleDatagridsToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { useResolvedDates } from "./hooks/useResolvedDates";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import type { DatePeriod } from "@/typings/DatePeriod";

import {
  autoSizeStrategy,
  defaultDataGridProps,
  getGroupingFieldsFromResponse,
} from "./utils";

import {
  useWinnersAndLosersConfig,
  useWinnersAndLosersState,
  useWinnersAndLosersData,
  useFormattedWinnersAndLosersData,
} from "./hooks";

const getDataPath = (data: { uniqueIds: string[] }) => data.uniqueIds;
const getRowId = (data: { uniqueIds: string[] }) => data.uniqueIds.join("-");

export interface WinnersAndLosersInvestmentProps {
  disableFilters?: boolean;
  defaultFilters?: Filters;
  showFilters?: boolean;
  showDateRangeSelect?: boolean;
  showTopSelect?: boolean;
  showGroupBySelect?: boolean;
  title?: string;
}

const WinnersAndLosersInvestmentContent = ({
  disableFilters,
  defaultFilters,
  showFilters = true,
  showDateRangeSelect = false,
  showTopSelect = true,
  title = "Top Winners & Losers",
}: WinnersAndLosersInvestmentProps) => {
  const gridRefWinners = useRef<GridApi | null>(null);
  const gridRefLosers = useRef<GridApi | null>(null);
  const dockViewPanelProps = usePanel();

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();

  const { config, isLoading: isLoadingConfig } = useWinnersAndLosersConfig();

  const { dateRange, datePeriod, handleDatePeriodChange } = useResolvedDates(
    showDateRangeSelect,
    (config.defaultDateRange?.period as unknown as DatePeriod) ?? "YTD"
  );

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const { selection, handleSelectionChange } = useWinnersAndLosersState({
    config,
  });

  const filterOptions = useMemo(
    () =>
      getFilterOptions(
        metricsCatalogData as MetricMetadata,
        config.supportedFilters
      ),
    [metricsCatalogData, config.supportedFilters]
  );

  const topOptions = useMemo(
    () =>
      (config.supportedTopN?.length ? config.supportedTopN : [config.topN]).map(
        (option) => ({
          label: `${option}`,
          value: String(option),
        })
      ),
    [config.supportedTopN, config.topN]
  );

  const dateRangeOptions = useMemo(
    () =>
      (config.supportedDateRanges ?? []).flatMap((period) =>
        period
          ? [
              {
                label: period,
                value: period,
              },
            ]
          : []
      ),
    [config.supportedDateRanges]
  );

  const effectiveDateRange = useMemo(() => {
    const period = dateRange.period;
    const supportedPeriods = config.supportedDateRanges ?? [];

    if (period && supportedPeriods.includes(period)) return dateRange;
    if (!period) return dateRange;

    return {
      start_date: null,
      end_date: null,
      period: config.defaultDateRange?.period ?? "YTD",
    };
  }, [config.defaultDateRange?.period, config.supportedDateRanges, dateRange]);

  const isDataEnabled =
    !!metricsCatalogData &&
    !isLoadingConfig &&
    (!!effectiveDateRange.period ||
      (!!effectiveDateRange.start_date && !!effectiveDateRange.end_date));

  const {
    winnersResponses,
    losersResponses,
    isLoading: isLoadingData,
    isLoadingInvalidate,
    refetch,
  } = useWinnersAndLosersData({
    dateRange: effectiveDateRange,
    topN: showTopSelect ? selection.top : config.topN,
    sharedFilters: !disableFilters
      ? (sharedFilters as Record<string, string[]>)
      : {},
    enabled: isDataEnabled,
  });

  const { winnersRows, losersRows, columns } = useFormattedWinnersAndLosersData(
    {
      winnersResponses,
      losersResponses,
      metricsCatalog,
    }
  );

  const groupingFields = useMemo(
    () =>
      getGroupingFieldsFromResponse(
        winnersResponses.length ? winnersResponses : losersResponses
      ),
    [winnersResponses, losersResponses]
  );

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    const headerName =
      metricsCatalog.find((m) => m.name === groupingFields[0])?.display_name ||
      groupingFields[0];

    return {
      flex: 1,
      minWidth: 150,
      headerName: headerName || "Group",
      resizable: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    };
  }, [metricsCatalog, groupingFields]);

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const isGlobalLoading = isLoadingCatalog || isLoadingConfig;
  const isLoading = isLoadingData || isGlobalLoading;

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: "responsive",
    }),
    []
  );

  return (
    <WidgetWrapper data-testid="winners-losers-investment-widget">
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
          {title}
        </WidgetTitle>
        <WidgetActions>
          {showDateRangeSelect && (
            <SkeletonWrapper
              isLoading={isGlobalLoading}
              skeletonClassName="w-[160px] h-9"
            >
              <TextSelect
                disablePortal
                virtual
                options={dateRangeOptions}
                value={datePeriod}
                placeholder="Date Range"
                onChange={handleDatePeriodChange}
                testId="winners-losers-investment-date-range-select"
              />
            </SkeletonWrapper>
          )}

          {showTopSelect && (
            <SkeletonWrapper
              isLoading={isGlobalLoading}
              skeletonClassName="w-[128px] h-9"
            >
              <TextSelect
                disablePortal
                virtual
                options={topOptions}
                value={selection.top}
                placeholder="Select Top"
                onChange={handleSelectionChange("top")}
                testId="winners-losers-investment-top-select"
              />
            </SkeletonWrapper>
          )}
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isLoadingData || isLoadingInvalidate}
          />
          <WidgetMaximizeButton id="winners-and-losers-investment-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      {showFilters && (
        <FilterController
          testId="winners-losers-investment-filter-controller"
          filterOptions={filterOptions}
          selectedFilters={filters}
          defaultFilters={defaultFilters}
          setSelectedFilters={setFilters}
          isLoadingMetricsCatalog={isGlobalLoading}
          disableSubFilterPortal
        />
      )}

      <WidgetBody
        data-testid={`winners-losers-investment-table-body-${dockViewPanelProps?.api.id}`}
      >
        <div className="flex size-full flex-col md:flex-row gap-4">
          <div className="winners-losers-table-ag-grid flex w-full md:w-1/2 flex-col border-none p-0">
            <h6 className="winners-losers-table-ag-grid-header border-b border-solid border-neutral-800 bg-neutral-900 px-3 py-2">
              <span className="text-sm font-medium text-green-100">
                Winners
              </span>
            </h6>
            <div className="size-full">
              <DataGrid
                key={`winners-${selection.top}`}
                gridRef={gridRefWinners}
                layout={dataGridLayout}
                rowData={winnersRows}
                columnDefs={columns}
                autoSizeStrategy={autoSizeStrategy}
                getRowId={getRowId}
                getDataPath={getDataPath}
                autoGroupColumnDef={autoGroupColumnDef}
                loading={isLoading}
                {...defaultDataGridProps}
                tooltipShowDelay={0}
                tooltipHideDelay={600000}
              />
            </div>
          </div>
          <div className="winners-losers-table-ag-grid flex w-full md:w-1/2 flex-col border-none p-0">
            <h6 className="winners-losers-table-ag-grid-header border-b border-solid border-neutral-800 bg-neutral-900 px-3 py-2">
              <span className="text-sm font-medium text-red-100">Losers</span>
            </h6>
            <div className="size-full">
              <DataGrid
                key={`losers-${selection.top}`}
                gridRef={gridRefLosers}
                layout={dataGridLayout}
                rowData={losersRows}
                columnDefs={columns}
                autoSizeStrategy={autoSizeStrategy}
                getRowId={getRowId}
                getDataPath={getDataPath}
                autoGroupColumnDef={autoGroupColumnDef}
                loading={isLoading}
                {...defaultDataGridProps}
                tooltipShowDelay={0}
                tooltipHideDelay={600000}
              />
            </div>
          </div>
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const WinnersAndLosersInvestmentOptimized = withAppInsights(
  WinnersAndLosersInvestmentContent,
  "WinnersAndLosersInvestmentOptimized"
);
