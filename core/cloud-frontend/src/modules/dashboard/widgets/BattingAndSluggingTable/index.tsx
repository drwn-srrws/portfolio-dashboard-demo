import {
  SizeColumnsToContentStrategy,
  GridState,
  GridApi,
} from "@ag-grid-community/core";
import { uniq } from "ramda";
import { useCallback, useMemo, useRef, useState } from "react";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { useGetPortfolioMetricsV3 } from "@/hooks/api/useGetPortfolioMetric";
import { MetricMetadata, MetricRequest } from "@api/types/index";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { Filters } from "@/typings/Filters";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { TextSelect } from "@/components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { omitBy } from "@/utils/omit";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import {
  battingAndSluggingDefaultColDef,
  createAutoGroupColumnDef,
  createBattingAndSluggingColumns,
} from "./BattingAndSluggingTable.columns";
import {
  calculateScalingCoefficient,
  flattenBattingAndSluggingHierarchy,
} from "./BattingAndSluggingTable.utils";
import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { getFilterOptions } from "@/components/FilterController/utils";
import { useDateRange } from "@/providers/DateRangeProvider";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";

export interface BattingAndSluggingTableProps {
  defaultGroupByMetric: string;
  groupByMetrics: string[];
  defaultMetrics: string[];
  defaultSortByMetric: string;
  defaultSortDirection: "asc" | "desc";
  defaultFilters?: Filters;
}

const nestedRowGroupingMetrics = "company_security_code_portfolio_asset_class";

const autoSizeStrategy: SizeColumnsToContentStrategy = {
  type: "fitCellContents",
};

const getDataPath = (data: { uniqueIds: string[] }) => data.uniqueIds;

const getRowId = (data: { uniqueIds: string[] }) => {
  return `${data?.uniqueIds?.join("-")}`;
};

const BattingAndSluggingTableContent = ({
  defaultGroupByMetric,
  groupByMetrics,
  defaultMetrics,
  defaultSortByMetric,
  defaultSortDirection,
  defaultFilters,
}: BattingAndSluggingTableProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters, setFilters } = useLocalFilters();
  const { metricFlags } = useMetricFlags();
  const { filters: sharedFilters } = useSharedFilters();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { startDate, endDate } = useDateRange();

  const { isMaximized } = usePanelMaximize();

  const [selectionState, setSelectionState] = useState<{
    groupBy: string;
  }>({
    groupBy: defaultGroupByMetric,
  });

  const { data: catalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const filterOptions = useMemo(() => {
    return getFilterOptions(catalogData as MetricMetadata);
  }, [catalogData]);

  const handleChangeGroupBy = useCallback((value: string) => {
    setSelectionState((prev) => ({
      ...prev,
      groupBy: value,
    }));
  }, []);

  const metricsCatalog = useMemo(() => {
    return catalogData?.metrics || [];
  }, [catalogData]);

  const displayOptions = useMemo(
    () =>
      groupByMetrics.map((metric) => ({
        label:
          metricsCatalog.find((m) => m.name === metric)?.display_name || metric,
        value: metric,
      })),
    [groupByMetrics, metricsCatalog]
  );

  const groupByConfigs = useMemo(() => {
    const configs: Record<string, string[][]> = {
      primary_analyst: [
        ["primary_analyst"],
        ["primary_analyst", "company_security_code_portfolio_asset_class"],
      ],
      company_subsector: [
        ["company_subsector"],
        ["company_subsector", "primary_analyst"],
        [
          "company_subsector",
          "primary_analyst",
          "company_security_code_portfolio_asset_class",
        ],
      ],
      direction: [
        ["direction"],
        ["direction", "primary_analyst"],
        [
          "direction",
          "primary_analyst",
          "company_security_code_portfolio_asset_class",
        ],
      ],
    };
    return (
      configs[selectionState.groupBy] || [
        [selectionState.groupBy],
        [selectionState.groupBy, nestedRowGroupingMetrics],
      ]
    );
  }, [selectionState.groupBy]);

  const metricsPayload: MetricRequest[] = useMemo(() => {
    return groupByConfigs.map((groupBy) => ({
      start_date: panelStartDate ?? startDate,
      end_date: panelEndDate ?? endDate,
      metrics: defaultMetrics.map((metric) => ({ name: metric })),
      group_by: groupBy,
      filters: omitBy(sharedFilters, (item) => !item.length),
    }));
  }, [
    groupByConfigs,
    defaultMetrics,
    endDate,
    panelEndDate,
    panelStartDate,
    sharedFilters,
    startDate,
  ]);

  const {
    isLoading: isLoadingBattingAndSluggingInvalidate,
    refetch: invalidateCache,
  } = useGetPortfolioMetricsV3(
    metricsPayload,
    { ...metricFlags, invalidate_cache: true },
    {
      query: {
        enabled: false,
      },
    }
  );

  const {
    data: battingAndSluggingServerData,
    isLoading: isLoadingBattingAndSluggingStats,
    refetch: refetchBattingAndSlugging,
  } = useGetPortfolioMetricsV3(metricsPayload, metricFlags, {
    query: {
      enabled: !!catalogData?.metrics,
    },
  });

  const totalMetricsPayload = useMemo(
    () => [
      {
        start_date: panelStartDate ?? startDate,
        end_date: panelEndDate ?? endDate,
        metrics: defaultMetrics.map((metric) => ({ name: metric })),
        group_by: [],
        filters: omitBy(sharedFilters, (item) => !item.length),
      },
    ],
    [
      panelStartDate,
      startDate,
      panelEndDate,
      endDate,
      defaultMetrics,
      sharedFilters,
    ]
  );

  const { isLoading: isLoadingTotalInvalidate, refetch: invalidateCacheTotal } =
    useGetPortfolioMetricsV3(
      totalMetricsPayload,
      { ...metricFlags, invalidate_cache: true },
      {
        query: {
          enabled: false,
        },
      }
    );

  const {
    data: totalBattingAndSluggingServerData,
    isLoading: isTotalBattingAndSluggingStatsLoading,
    refetch: refetchTotal,
  } = useGetPortfolioMetricsV3(totalMetricsPayload, metricFlags, {
    query: {
      enabled: !!catalogData?.metrics,
    },
  });

  const totalBattingSluggingMetrics = useMemo(
    () => totalBattingAndSluggingServerData || [],
    [totalBattingAndSluggingServerData]
  );

  const totalBattingAndSluggingData = useMemo(
    () => totalBattingSluggingMetrics?.[0]?.data || [],
    [totalBattingSluggingMetrics]
  );

  const totalRowData = useMemo(() => {
    return [
      {
        ...totalBattingAndSluggingData[0],
        fieldHeader: "Total",
      },
    ];
  }, [totalBattingAndSluggingData]);

  const formattedData = useMemo(() => {
    const battingAndSluggingMetrics = battingAndSluggingServerData || [];

    const dataLevels = battingAndSluggingMetrics.map(
      (metric) => metric?.data || []
    );

    const groupingFields = groupByConfigs[groupByConfigs.length - 1];

    return flattenBattingAndSluggingHierarchy({
      dataLevels,
      groupingFields,
    });
  }, [battingAndSluggingServerData, groupByConfigs]);

  const coefficient = useMemo(
    () => calculateScalingCoefficient(formattedData),
    [formattedData]
  );

  const columnOrderMetrics = useMemo(
    () => uniq([selectionState.groupBy, ...defaultMetrics]),
    [selectionState.groupBy, defaultMetrics]
  );

  const columnsAfterExclusion = useMemo(() => {
    if (selectionState.groupBy === "primary_analyst") {
      return columnOrderMetrics.filter(
        (metric) =>
          metric !== selectionState.groupBy &&
          metric !== "primary_analyst_avatar"
      );
    }
    return columnOrderMetrics.filter(
      (metric) => metric !== selectionState.groupBy
    );
  }, [columnOrderMetrics, selectionState.groupBy]);

  const columns = useMemo(
    () =>
      createBattingAndSluggingColumns(
        metricsCatalog,
        columnsAfterExclusion,
        coefficient
      ),
    [metricsCatalog, columnsAfterExclusion, coefficient]
  );

  const autoGroupColumnDef = useMemo(
    () => createAutoGroupColumnDef(metricsCatalog, selectionState.groupBy),
    [metricsCatalog, selectionState.groupBy]
  );

  const initialState: GridState = useMemo(
    () => ({
      sort: {
        sortModel: [
          {
            colId: defaultSortByMetric,
            sort: defaultSortDirection,
          },
        ],
      },
    }),
    [defaultSortByMetric, defaultSortDirection]
  );

  const isLoading = useMemo(
    () =>
      isLoadingCatalog ||
      isLoadingBattingAndSluggingStats ||
      isTotalBattingAndSluggingStatsLoading,
    [
      isLoadingCatalog,
      isLoadingBattingAndSluggingStats,
      isTotalBattingAndSluggingStatsLoading,
    ]
  );

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }),
    [isMaximized]
  );

  const exportToCSV = useCallback(
    (name: string) => {
      const headers = groupByConfigs[groupByConfigs.length - 1].map((field) => {
        const metric = metricsCatalog.find((m) => m.name === field);
        return metric?.display_name || field;
      });
      exportDatagridToCSV(gridRef, name, headers);
    },
    [metricsCatalog, groupByConfigs]
  );

  const isRefreshing = useMemo(
    () =>
      isLoadingBattingAndSluggingInvalidate ||
      isLoadingTotalInvalidate ||
      isLoadingCatalog,
    [
      isLoadingBattingAndSluggingInvalidate,
      isLoadingTotalInvalidate,
      isLoadingCatalog,
    ]
  );

  const handleRefetch = useCallback(async () => {
    await Promise.all([invalidateCache(), invalidateCacheTotal()]);
    await Promise.all([refetchBattingAndSlugging(), refetchTotal()]);
  }, [
    invalidateCache,
    invalidateCacheTotal,
    refetchBattingAndSlugging,
    refetchTotal,
  ]);

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle {...{ exportToCSV }}>Batting & Slugging Stats</WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isRefreshing}
          />
          <SkeletonWrapper
            isLoading={isLoadingCatalog}
            skeletonClassName="h-9 w-[128px]"
          >
            <TextSelect
              virtual
              disablePortal
              placeholder="Aggregate By"
              options={displayOptions}
              value={selectionState.groupBy}
              onChange={(value) => handleChangeGroupBy(`${value}`)}
              testId="batting-and-slugging-group-by-select"
            />
          </SkeletonWrapper>
          <WidgetMaximizeButton id="batting-and-slugging-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <FilterController
        id="batting-and-slugging-filter-controller"
        filterOptions={filterOptions}
        selectedFilters={filters}
        setSelectedFilters={setFilters}
        defaultFilters={defaultFilters}
        testId="batting-and-slugging-filter-controller"
        disableSubFilterPortal
      />

      <WidgetBody data-testid="batting-and-slugging-table-body">
        <DataGrid
          gridRef={gridRef}
          layout={dataGridLayout}
          rowData={formattedData}
          columnDefs={columns}
          autoSizeStrategy={autoSizeStrategy}
          defaultColDef={battingAndSluggingDefaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          sideBar={false}
          suppressAggFuncInHeader={true}
          animateRows={false}
          getDataPath={getDataPath}
          loading={isLoading}
          getRowId={getRowId}
          treeData={true}
          stopEditingWhenCellsLoseFocus={true}
          initialState={initialState}
          tooltipShowDelay={0}
          tooltipHideDelay={600000}
          pinnedBottomRowData={totalRowData}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const BattingAndSluggingTable = withAppInsights(
  BattingAndSluggingTableContent,
  "BattingAndSluggingTable"
);
