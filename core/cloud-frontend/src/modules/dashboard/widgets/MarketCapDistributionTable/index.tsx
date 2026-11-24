import { ColDef, GridApi } from "@ag-grid-community/core";
import { useCallback, useMemo, useRef } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";
import { MetricMetadata, MetricRequest } from "@api/types/index";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { omitBy } from "@/utils/omit";
import { formatDataToNestedTableData } from "@/utils/table";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import {
  autoSizeStrategy,
  createMarketCapDistributionColumns,
  defaultDataGridProps,
  marketCapAutoGroupColumn,
} from "./MarketCapDistributionTable.columns";
import { getFilterOptions } from "@/components/FilterController/utils";
import { Filters } from "@typings/Filters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useDateRange } from "@/providers/DateRangeProvider";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";

export interface MarketCapDistributionTableProps {
  defaultMetrics: string[];
  defaultGroupByMetric: string;
  defaultFilters?: Filters;
  defaultSubgroupBy: string;
}

const getDataPath = (data: { uniqueIds: string[] }) => data.uniqueIds;

const getRowId = (data: { uniqueIds: string[] }) => data.uniqueIds.join("-");

const MarketCapDistributionTableContent = ({
  defaultGroupByMetric,
  defaultMetrics,
  defaultSubgroupBy,
  defaultFilters,
}: MarketCapDistributionTableProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { metricFlags } = useMetricFlags();
  const { filters: sharedFilters } = useSharedFilters();
  const { isMaximized } = usePanelMaximize();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { startDate, endDate } = useDateRange();

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

  const metricsCatalog = useMemo(() => {
    return metricsCatalogUnfiltered.filter((metric) =>
      defaultMetrics.includes(metric.name)
    );
  }, [metricsCatalogUnfiltered, defaultMetrics]);

  const parentMetricRequest: MetricRequest = useMemo(
    () => ({
      start_date: panelStartDate ?? startDate,
      end_date: panelEndDate ?? endDate,
      metrics: metricsCatalog.map((option) => ({ name: option.name })),
      group_by: [defaultGroupByMetric],
      filters: omitBy(sharedFilters, (item) => !item.length),
      sort_by: {
        sort_by: [defaultGroupByMetric],
        sort_descending: false,
      },
    }),
    [
      panelStartDate,
      panelEndDate,
      startDate,
      endDate,
      metricsCatalog,
      defaultGroupByMetric,
      sharedFilters,
    ]
  );

  const childMetricRequest: MetricRequest = useMemo(
    () => ({
      start_date: panelStartDate ?? startDate,
      end_date: panelEndDate ?? endDate,
      metrics: metricsCatalog.map((option) => ({ name: option.name })),
      group_by: [defaultGroupByMetric, defaultSubgroupBy],
      filters: omitBy(sharedFilters, (item) => !item.length),
      sort_by: {
        sort_by: [defaultGroupByMetric, defaultSubgroupBy],
        sort_descending: false,
      },
    }),
    [
      panelStartDate,
      panelEndDate,
      startDate,
      endDate,
      metricsCatalog,
      defaultGroupByMetric,
      defaultSubgroupBy,
      sharedFilters,
    ]
  );

  const { isLoading: isLoadingMarketCapInvalidate, refetch: invalidateCache } =
    useGetPortfolioMetricsV3(
      [parentMetricRequest, childMetricRequest],
      { ...metricFlags, invalidate_cache: true },
      { query: { enabled: false } }
    );

  const {
    data: marketCap,
    isLoading: isLoadingMarketCap,
    refetch: refetchMarketCap,
  } = useGetPortfolioMetricsV3(
    [parentMetricRequest, childMetricRequest],
    metricFlags,
    {
      query: {
        enabled: !!metricsCatalogData,
      },
    }
  );

  const marketCapData = useMemo(() => marketCap?.[0]?.data || [], [marketCap]);

  const marketCapNestedData = useMemo(
    () => marketCap?.[1]?.data || [],
    [marketCap]
  );

  const marketCapRows = useMemo(() => {
    return formatDataToNestedTableData({
      topLevelEntries: marketCapData,
      nestedEntries: marketCapNestedData,
      primaryGroupingField: defaultGroupByMetric,
      secondaryGroupingField: defaultSubgroupBy,
    });
  }, [
    defaultGroupByMetric,
    defaultSubgroupBy,
    marketCapData,
    marketCapNestedData,
  ]);

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      ...marketCapAutoGroupColumn,
      headerName: metricsCatalogUnfiltered.find(
        (metric) => metric.name === defaultSubgroupBy
      )?.display_name,
      headerTooltip: metricsCatalogUnfiltered.find(
        (metric) => metric.name === defaultSubgroupBy
      )?.description,
    };
  }, [defaultSubgroupBy, metricsCatalogUnfiltered]);

  const columns = useMemo(
    () => createMarketCapDistributionColumns(metricsCatalog, defaultMetrics),
    [metricsCatalog, defaultMetrics]
  );

  const isLoading = useMemo(() => {
    return isLoadingCatalog || isLoadingMarketCap;
  }, [isLoadingCatalog, isLoadingMarketCap]);

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: isMaximized ? "normal" : "responsive",
    }),
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetchMarketCap();
  }, [invalidateCache, refetchMarketCap]);

  return (
    <WidgetWrapper data-testid="market-cap-distribution-widget">
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Market Cap Distribution
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isLoadingMarketCapInvalidate || isLoadingCatalog}
          />
          <WidgetMaximizeButton id="market-cap-distribution-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        id="market-cap-distribution-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isLoadingCatalog}
        testId="market-cap-distribution-filter-controller"
        defaultFilters={defaultFilters}
        disableSubFilterPortal
      />

      <WidgetBody data-testid="market-cap-distribution-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={marketCapRows}
            columnDefs={columns}
            loading={isLoading}
            autoSizeStrategy={autoSizeStrategy}
            autoGroupColumnDef={autoGroupColumnDef}
            getDataPath={getDataPath}
            getRowId={getRowId}
            rowSelection="multiple"
            tooltipShowDelay={0}
            tooltipHideDelay={600000}
            {...defaultDataGridProps}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const MarketCapDistributionTable = withAppInsights(
  MarketCapDistributionTableContent,
  "MarketCapDistributionTable"
);
