import { useCallback, useMemo, useRef } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { Filters } from "@/typings/Filters";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { TextSelect } from "@/components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { useSelection } from "@hooks/useSelection";
import { createMetricOptions } from "@/utils/metricOptions";
import { useSharedYear } from "@/hooks/useSharedYear";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { MonthlyPerformanceTable } from "./components/MonthlyPerformanceTable";
import {
  formatMonthlyPerformanceData,
  generateMonthlyBreakdown,
  getDateRangeByYear,
  years,
} from "./components/MonthlyPerformanceTable/MonthlyPerformanceTable.utils";
import { useMetricsByMonth } from "./hooks/useMetricsByMonth";
import { useTotalMetrics } from "./hooks/useTotalMetrics";
import { MetricMetadata, MetricDisplayType } from "@/api/types";
import { usePanel } from "@/providers/PanelProvider";
import { getFilterOptions } from "@/components/FilterController/utils";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { GridApi } from "@ag-grid-community/core";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { useIsMobile } from "@/hooks/useMobile";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";

export interface MonthlyPerformanceSelection {
  groupBy: string;
}

export interface MonthlyPerformanceProps {
  groupByMetrics: string[];
  totalMetric: string;
  defaultGroupByMetric: string;
  defaultFilters?: Filters;
}

const MonthlyPerformanceContent = ({
  groupByMetrics,
  totalMetric,
  defaultGroupByMetric,
  defaultFilters,
}: MonthlyPerformanceProps) => {
  const dockViewPanelProps = usePanel();
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { selectedYear, setSelectedLocalYear: setLocalYear } = useSharedYear();

  const { selection, handleSelectionChange } =
    useSelection<MonthlyPerformanceSelection>({
      groupBy: defaultGroupByMetric,
    });

  const combinedFilters = useMemo(() => {
    return {
      ...defaultFilters,
      ...sharedFilters,
    };
  }, [defaultFilters, sharedFilters]);

  const metricFlagsWithGL = useMemo(() => {
    const activeFilters = Object.keys(combinedFilters).filter(
      (key) => combinedFilters[key] && combinedFilters[key].length > 0
    );

    if (selection.groupBy === "fund_name") {
      const nonFundFilters = activeFilters.filter((key) => key !== "fund_name");
      if (nonFundFilters.length === 0) {
        return {
          ...metricFlags,
          include_gl: true,
        };
      }
      return metricFlags;
    }

    if (activeFilters.length === 1 && activeFilters[0] === "fund_name") {
      return {
        ...metricFlags,
        include_gl: true,
      };
    }

    return metricFlags;
  }, [metricFlags, combinedFilters, selection.groupBy]);

  const { monthlyDateRanges, dateRanges } = useMemo(() => {
    const { start, end } = getDateRangeByYear(selectedYear);

    return {
      monthlyDateRanges: generateMonthlyBreakdown(start, end),
      dateRanges: { start, end },
    };
  }, [selectedYear]);

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const filterOptions = useMemo(() => {
    return getFilterOptions(metricsCatalogData as MetricMetadata);
  }, [metricsCatalogData]);

  const {
    totalData,
    isLoadingTotal,
    refetchTotal,
    isLoadingTotalInvalidate,
    invalidateCacheTotal,
  } = useTotalMetrics({
    groupBy: selection.groupBy,
    totalMetric,
    metricsCatalogData,
    dateRanges,
    sharedFilters: combinedFilters,
    metricFlags: metricFlagsWithGL,
  });

  const {
    byMonthData,
    isLoadingByMonth,
    refetchByMonth,
    isLoadingByMonthInvalidate,
    invalidateCacheByMonth,
  } = useMetricsByMonth({
    groupBy: selection.groupBy,
    totalMetric,
    metricsCatalogData,
    dateRanges: monthlyDateRanges,
    sharedFilters: combinedFilters,
    metricFlags: metricFlagsWithGL,
  });

  const formatedData = useMemo(
    () =>
      formatMonthlyPerformanceData(
        totalData,
        byMonthData,
        selection.groupBy,
        monthlyDateRanges,
        totalMetric
      ),
    [totalData, byMonthData, selection.groupBy, monthlyDateRanges, totalMetric]
  );

  const metricsCatalogUnfiltered = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const metricsCatalog = useMemo(() => {
    return metricsCatalogUnfiltered.filter(
      (metric) => metric.name === totalMetric
    );
  }, [metricsCatalogUnfiltered, totalMetric]);

  const groupByOptions = useMemo(
    () => createMetricOptions(groupByMetrics, metricsCatalogUnfiltered),
    [groupByMetrics, metricsCatalogUnfiltered]
  );

  const metric = useMemo(() => {
    return metricsCatalogUnfiltered.find(
      (metric) => metric.name === totalMetric
    );
  }, [metricsCatalogUnfiltered, totalMetric]);

  const metricDisplayType = useMemo(() => {
    return metric?.display_type || MetricDisplayType.percent;
  }, [metric]);

  const metricDescription = useMemo(() => {
    return metric?.description || metric?.display_name;
  }, [metric]);

  const yearOptions = useMemo(
    () =>
      years.map((year) => ({
        label: year.toString(),
        value: year.toString(),
      })),
    []
  );

  const isLoading = useMemo(() => {
    return isLoadingCatalog || isLoadingTotal || isLoadingByMonth;
  }, [isLoadingCatalog, isLoadingTotal, isLoadingByMonth]);

  const handleYearChange = useCallback(
    (value: string | number | boolean) => {
      const newYear = value.toString();
      setLocalYear(newYear);
    },
    [setLocalYear]
  );

  const filterControllerId = useMemo(
    () =>
      `monthly-performance-table-filter-controller-${dockViewPanelProps?.api.id}`,
    [dockViewPanelProps?.api.id]
  );

  const widgetBodyId = useMemo(
    () => `monthly-performance-table-body-${dockViewPanelProps?.api.id}`,
    [dockViewPanelProps?.api.id]
  );

  const isMobile = useIsMobile();

  const isRefreshing = useMemo(() => {
    return (
      isLoadingTotalInvalidate || isLoadingByMonthInvalidate || isLoadingCatalog
    );
  }, [isLoadingTotalInvalidate, isLoadingByMonthInvalidate, isLoadingCatalog]);

  const handleRefetch = useCallback(async () => {
    await Promise.all([invalidateCacheTotal(), invalidateCacheByMonth()]);
    await Promise.all([refetchTotal(), refetchByMonth()]);
  }, [
    invalidateCacheTotal,
    invalidateCacheByMonth,
    refetchTotal,
    refetchByMonth,
  ]);

  const Actions = () => (
    <div className="flex gap-3 justify-end">
      <WidgetRefetchButton
        onRefetch={handleRefetch}
        isRefreshing={isRefreshing}
      />
      <SkeletonWrapper
        isLoading={isLoadingCatalog}
        skeletonClassName="w-[128px] h-9"
      >
        <TextSelect
          disablePortal
          virtual
          options={yearOptions}
          value={selectedYear}
          placeholder="Select Year"
          onChange={handleYearChange}
        />
      </SkeletonWrapper>
      <SkeletonWrapper
        isLoading={isLoadingCatalog}
        skeletonClassName="w-[128px] h-9"
      >
        <TextSelect
          disablePortal
          virtual
          options={groupByOptions}
          value={selection.groupBy}
          placeholder="Aggregate By"
          onChange={handleSelectionChange("groupBy")}
          testId="monthly-performance-group-by-select"
        />
      </SkeletonWrapper>
    </div>
  );

  return (
    <WidgetWrapper testId="mountly-performance-widget">
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Monthly Performance
        </WidgetTitle>
        <WidgetActions>
          {!isMobile && <Actions />}
          <WidgetMaximizeButton />
        </WidgetActions>
      </WidgetHeader>

      {isMobile && <Actions />}

      <FilterController
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        defaultFilters={defaultFilters}
        disableSubFilterPortal
        testId={filterControllerId}
      />

      <WidgetBody data-testid={widgetBodyId}>
        <MonthlyPerformanceTable
          gridRef={gridRef}
          isLoading={isLoading}
          groupBy={selection.groupBy}
          metricsCatalog={metricsCatalog}
          dateRanges={monthlyDateRanges}
          metricsCatalogUnfiltered={metricsCatalogUnfiltered}
          formatedData={formatedData}
          metricDisplayType={metricDisplayType}
          metricDescription={metricDescription}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const MonthlyPerformance = withAppInsights(
  MonthlyPerformanceContent,
  "MonthlyPerformance"
);
