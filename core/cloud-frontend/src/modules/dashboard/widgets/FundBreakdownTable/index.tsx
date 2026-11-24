import { GridApi } from "@ag-grid-community/core";
import { useCallback, useMemo, useRef } from "react";

import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";

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
  getFundBreakdownRequest,
  transformFundBreakdownResponse,
} from "./FundBreakdownTable.utils";
import { getFilterOptions } from "@/components/FilterController/utils";
import { MetricMetadata } from "@/api/types";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useDateRange } from "@/providers/DateRangeProvider";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { FundBreakDownGrid } from "./FundBreakDownGrid";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";

export interface FundBreakdownTableTableProps {
  defaultSubgroupBy?: string;
  defaultGroupByMetric?: string;
}

const FundBreakdownTableContent = ({
  defaultGroupByMetric = "name",
  defaultSubgroupBy = "company_security_code_portfolio_asset_class",
}: FundBreakdownTableTableProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { startDate, endDate } = useDateRange();

  const metricsRequests = useMemo(
    () =>
      getFundBreakdownRequest({
        startDate: (panelStartDate ?? startDate) as string,
        endDate: (panelEndDate ?? endDate) as string,
        metricFlags,
        filters: omitBy(sharedFilters, (item) => !item.length),
      }),
    [
      panelStartDate,
      startDate,
      panelEndDate,
      endDate,
      metricFlags,
      sharedFilters,
    ]
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
    isLoading: isLoadingFundBreakdownInvalidate,
    refetch: invalidateCache,
  } = useGetPortfolioMetricsV3(
    metricsRequests,
    { ...metricFlags, invalidate_cache: true },
    { query: { enabled: false } }
  );

  const {
    data,
    isLoading: isLoadingFundBreakdown,
    refetch: refetchFundBreakdown,
  } = useGetPortfolioMetricsV3(metricsRequests, metricFlags);

  const { transformedData, nestedData } = useMemo(
    () => transformFundBreakdownResponse(data || [], metricFlags),
    [data, metricFlags]
  );

  const formattedData = useMemo(
    () =>
      formatDataToNestedTableData({
        topLevelEntries: transformedData,
        nestedEntries: nestedData,
        primaryGroupingField: defaultGroupByMetric as "name" | "value",
        secondaryGroupingField: defaultSubgroupBy as "name" | "value",
      }),
    [transformedData, nestedData, defaultGroupByMetric, defaultSubgroupBy]
  );

  const metricsCatalogUnfiltered = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const handleRefetch = useCallback(async () => {
    await invalidateCache();
    await refetchFundBreakdown();
  }, [invalidateCache, refetchFundBreakdown]);

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Fund Breakdown
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={
              isLoadingFundBreakdownInvalidate || isLoadingMetricsCatalog
            }
          />
          <WidgetMaximizeButton id="fund-breakdown-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        id="fund-breakdown-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        isLoadingMetricsCatalog={isLoadingMetricsCatalog}
        testId="fund-breakdown-filter-controller"
        disableSubFilterPortal
      />

      <WidgetBody
        data-testid={
          isLoadingFundBreakdown
            ? "fund-breakdown-table-body-skeleton"
            : "fund-breakdown-table-body"
        }
      >
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <FundBreakDownGrid
            gridRef={gridRef}
            rowData={formattedData}
            loading={isLoadingFundBreakdown}
            metricsCatalogUnfiltered={metricsCatalogUnfiltered}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const FundBreakdownTable = withAppInsights(
  FundBreakdownTableContent,
  "FundBreakdownTable"
);
