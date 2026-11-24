import { useCallback, useMemo, useRef } from "react";

import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { omitBy } from "@/utils/omit";
import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import {
  defaultDataGridProps,
  getFundSummaryColumns,
} from "./FundSummaryTable.columns";
import {
  getFundSummaryPayload1,
  getFundSummaryPayload2,
  shouldIncludeGL,
  transformFundSummaryResponse,
  FundSummaryRow,
} from "./FundSummaryTable.utils";
import { getFilterOptions } from "@/components/FilterController/utils";
import { MetricMetadata } from "@/api/types";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useDateRange } from "@/providers/DateRangeProvider";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";

import { GridApi, SizeColumnsToFitGridStrategy } from "@ag-grid-community/core";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";

const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
  type: "fitGridWidth",
};

const getRowId = (data: FundSummaryRow) => {
  return data.id;
};

const FundSummaryTableContent = () => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { startDate, endDate } = useDateRange();

  const cleanedFilters = useMemo(
    () => omitBy(sharedFilters, (item) => !item.length),
    [sharedFilters]
  );

  const metricFlagsWithGL = useMemo(() => {
    if (shouldIncludeGL(cleanedFilters)) {
      return {
        ...metricFlags,
        include_gl: true,
      };
    }
    return metricFlags;
  }, [metricFlags, cleanedFilters]);

  const payload1Requests = useMemo(
    () =>
      getFundSummaryPayload1({
        startDate: (panelStartDate ?? startDate) as string,
        endDate: (panelEndDate ?? endDate) as string,
        filters: cleanedFilters,
      }),
    [panelStartDate, startDate, panelEndDate, endDate, cleanedFilters]
  );

  const payload2Requests = useMemo(
    () =>
      getFundSummaryPayload2({
        startDate: (panelStartDate ?? startDate) as string,
        endDate: (panelEndDate ?? endDate) as string,
        filters: cleanedFilters,
      }),
    [panelStartDate, startDate, panelEndDate, endDate, cleanedFilters]
  );

  const { data: metricsCatalogData, isLoading: isLoadingMetricsCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const filterOptions = useMemo(() => {
    return getFilterOptions(metricsCatalogData as MetricMetadata);
  }, [metricsCatalogData]);

  const {
    isLoading: isLoadingPayload1Invalidate,
    refetch: invalidatePayload1Cache,
  } = useGetPortfolioMetricsV3(
    payload1Requests,
    { ...metricFlagsWithGL, invalidate_cache: true },
    { query: { enabled: false } }
  );

  const {
    data: payload1Data,
    isLoading: isLoadingPayload1,
    refetch: refetchPayload1,
  } = useGetPortfolioMetricsV3(payload1Requests, metricFlagsWithGL);

  const {
    isLoading: isLoadingPayload2Invalidate,
    refetch: invalidatePayload2Cache,
  } = useGetPortfolioMetricsV3(
    payload2Requests,
    { ...metricFlags, invalidate_cache: true },
    { query: { enabled: false } }
  );

  const {
    data: payload2Data,
    isLoading: isLoadingPayload2,
    refetch: refetchPayload2,
  } = useGetPortfolioMetricsV3(payload2Requests, metricFlags);

  const data = useMemo(() => {
    if (!payload1Data || !payload2Data) return undefined;
    return [...payload1Data, ...payload2Data];
  }, [payload1Data, payload2Data]);

  const isLoadingFundSummary = isLoadingPayload1 || isLoadingPayload2;

  const rows = useMemo(() => transformFundSummaryResponse(data || []), [data]);

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: isMaximized ? "normal" : "responsive",
    }),
    [isMaximized]
  );

  const metricsCatalogUnfiltered = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const fundSummaryColumns = useMemo(
    () => getFundSummaryColumns(metricsCatalogUnfiltered),
    [metricsCatalogUnfiltered]
  );

  const handleRefetch = useCallback(async () => {
    await Promise.all([invalidatePayload1Cache(), invalidatePayload2Cache()]);
    await Promise.all([refetchPayload1(), refetchPayload2()]);
  }, [
    invalidatePayload1Cache,
    invalidatePayload2Cache,
    refetchPayload1,
    refetchPayload2,
  ]);

  return (
    <WidgetWrapper data-testid="fund-summary-widget">
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Fund Summary
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={
              isLoadingPayload1Invalidate ||
              isLoadingPayload2Invalidate ||
              isLoadingMetricsCatalog
            }
          />
          <WidgetMaximizeButton id="fund-summary-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        id="fund-summary-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isLoadingMetricsCatalog}
        testId="fund-summary-filter-controller"
        disableSubFilterPortal
      />

      <WidgetBody data-testid="fund-summary-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={fundSummaryColumns}
            getRowId={getRowId}
            loading={isLoadingFundSummary}
            autoSizeStrategy={autoSizeStrategy}
            rowSelection="multiple"
            {...defaultDataGridProps}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const FundSummaryTable = withAppInsights(
  FundSummaryTableContent,
  "FundSummaryTable"
);
