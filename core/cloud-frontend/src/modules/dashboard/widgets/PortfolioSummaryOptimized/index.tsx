import { ColDef, GridApi, ValueFormatterParams } from "@ag-grid-community/core";
import { useCallback, useMemo, useRef, useState } from "react";
import { SearchField } from "@modules/dashboard/widgets/CoverageUniverse/components/SearchField";
import { useDebounceCallback } from "@/hooks/useDebouncedCallback";

import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";
import { MetricMetadata } from "@api/types/index";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { DataGrid, DataGridLayout } from "@components/Datagrid/Datagrid";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import FilterController from "@/components/FilterController/FilterController";
import { Filters } from "@/typings/Filters";
import { TextSelect } from "@/components/TextSelect";
import { BadgeMultiSelect } from "@components/BadgeMultiSelect";
import { Icon } from "@/components/Icon/Icon";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { createMetricOptions } from "@/utils/metricOptions";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { getFilterOptions } from "@/components/FilterController/utils";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { useOptimizedDateRange } from "@/providers/OptimizedDateRangeProvider";
import type { DateRangeRequest } from "@/api/aliases";
import { compactDateRangeRequest } from "@/utils/dateRange";

import {
  autoSizeStrategy,
  buildNestedRows,
  createPortfolioSummaryColumns,
  defaultDataGridProps,
  getGroupingFieldsFromResponse,
  getMetricNamesFromResponse,
  getSelectableMetricNamesFromResponse,
} from "./utils";
import { usePortfolioSummaryConfig, usePortfolioSummaryData } from "./hooks";

const getDataPath = (data: { uniqueIds: string[] }) => data.uniqueIds;
const getRowId = (data: { uniqueIds: string[] }) => data.uniqueIds.join("-");

export interface PortfolioSummaryOptimizedProps {
  defaultFilters?: Filters;
}

const PortfolioSummaryOptimizedContent = ({
  defaultFilters,
}: PortfolioSummaryOptimizedProps) => {
  const gridRef = useRef<GridApi | null>(null);

  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags } = useMetricFlags();
  const { isMaximized } = usePanelMaximize();
  const { account } = useAuth();

  const [showMyCoverageOnly, setShowMyCoverageOnly] = useState<boolean>(false);

  const handleMyCoverageToggle = useCallback((value: boolean) => {
    setShowMyCoverageOnly(value);
  }, []);

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { requestDateRange } = useOptimizedDateRange();

  const { config, isLoading: isLoadingConfig } = usePortfolioSummaryConfig();

  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQueryValue, _setSearchQueryValue] = useState("");
  const setSearchQueryValue = useDebounceCallback(_setSearchQueryValue, 500);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(event.target.value);
      setSearchQueryValue(event.target.value);
    },
    [setSearchQueryValue]
  );

  const [selectedGroupBy, setSelectedGroupBy] = useState<string>("");

  const effectiveGroupBy =
    selectedGroupBy || config.defaultGroupBy || "instrument_group";

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      ...metricFlags,
      include_filterable_values: true,
    });

  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const filterOptions = useMemo(
    () =>
      getFilterOptions(
        metricsCatalogData as MetricMetadata,
        config.supportedFilters
      ),
    [metricsCatalogData, config.supportedFilters]
  );

  const groupByOptions = useMemo(
    () =>
      createMetricOptions(
        config.selectableDimensions,
        metricsCatalog as { name: string; display_name: string }[]
      ),
    [config.selectableDimensions, metricsCatalog]
  );

  const effectiveDateRange: DateRangeRequest = useMemo(() => {
    if (panelStartDate || panelEndDate) {
      return compactDateRangeRequest({
        start_date: panelStartDate,
        end_date: panelEndDate,
      });
    }
    return compactDateRangeRequest(requestDateRange);
  }, [panelEndDate, panelStartDate, requestDateRange]);

  const isDataEnabled =
    !!metricsCatalogData &&
    !isLoadingConfig &&
    (!!effectiveDateRange.period ||
      (!!effectiveDateRange.start_date && !!effectiveDateRange.end_date));

  const {
    responses,
    isLoading: isLoadingData,
    isLoadingInvalidate,
    refetch,
  } = usePortfolioSummaryData({
    dateRange: effectiveDateRange,
    groupBy: effectiveGroupBy,
    sharedFilters: sharedFilters as Record<string, string[]>,
    enabled: isDataEnabled,
  });

  const allRows = useMemo(() => buildNestedRows(responses), [responses]);

  const rows = useMemo(() => {
    if (!showMyCoverageOnly || !account?.email) {
      return allRows;
    }

    const userEmail = account.email;

    return allRows.filter((item) => {
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
  }, [allRows, showMyCoverageOnly, account?.email]);

  const metricNames = useMemo(
    () => getMetricNamesFromResponse(responses),
    [responses]
  );

  const selectableMetricNames = useMemo(
    () => getSelectableMetricNamesFromResponse(responses),
    [responses]
  );

  const groupingFields = useMemo(
    () => getGroupingFieldsFromResponse(responses),
    [responses]
  );

  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const effectiveColumns = useMemo(
    () => (selectedColumns.length > 0 ? selectedColumns : metricNames),
    [selectedColumns, metricNames]
  );

  const columnOptions = useMemo(
    () =>
      createMetricOptions(
        selectableMetricNames,
        metricsCatalog as { name: string; display_name: string }[]
      ),
    [selectableMetricNames, metricsCatalog]
  );

  const columns = useMemo(
    () =>
      effectiveColumns.length
        ? createPortfolioSummaryColumns(metricsCatalog, effectiveColumns)
        : [],
    [metricsCatalog, effectiveColumns]
  );

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    const headerName =
      metricsCatalog.find((m) => m.name === groupingFields[0])?.display_name ||
      groupingFields[0];

    const headerTooltip =
      metricsCatalog.find((m) => m.name === groupingFields[0])?.description ||
      groupingFields[0];

    return {
      flex: 1,
      minWidth: 120,
      headerName: headerName || "Name",
      headerTooltip: headerTooltip || undefined,
      headerClass: "scalable-table-header",
      resizable: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      cellRendererParams: {
        suppressCount: true,
      },
      valueFormatter: (params: ValueFormatterParams) => {
        const value = params.value;
        const count = params.node?.childrenAfterGroup?.length;
        return count ? `${value} (${count})` : value;
      },
    };
  }, [metricsCatalog, groupingFields]);

  const isGlobalLoading = isLoadingCatalog || isLoadingConfig;
  const isLoading = isLoadingData || isGlobalLoading;

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({ mode: isMaximized ? "normal" : "responsive" }),
    [isMaximized]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <WidgetWrapper data-testid="portfolio-summary-optimized-widget">
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Portfolio Summary
        </WidgetTitle>
        <WidgetActions>
          {groupByOptions.length > 0 && (
            <SkeletonWrapper
              isLoading={isGlobalLoading}
              skeletonClassName="w-[180px] h-9"
            >
              <TextSelect
                disablePortal
                virtual
                options={groupByOptions}
                value={effectiveGroupBy}
                placeholder="Group By"
                onChange={(value) => setSelectedGroupBy(String(value))}
                testId="portfolio-summary-optimized-group-by-select"
              />
            </SkeletonWrapper>
          )}
          {columnOptions.length > 0 && (
            <SkeletonWrapper
              isLoading={isGlobalLoading}
              skeletonClassName="size-9"
            >
              <BadgeMultiSelect
                disablePortal
                options={columnOptions}
                value={effectiveColumns}
                alwaysShowPlaceholder
                variant="triggerOnly"
                testId="portfolio-summary-optimized-metrics-select"
                placeholder={<Icon name="Columns3" color="#ffffff" size="lg" />}
                handleReset={() => setSelectedColumns([])}
                onChange={(value) => setSelectedColumns(value as string[])}
              />
            </SkeletonWrapper>
          )}
          <WidgetRefetchButton
            onRefetch={handleRefetch}
            isRefreshing={isLoadingData || isLoadingInvalidate}
          />
          <WidgetMaximizeButton id="portfolio-summary-optimized-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <SearchField
            value={searchInputValue}
            onChange={handleSearchChange}
            testId="portfolio-summary-optimized-search-field"
          />
          <FilterController
            id="portfolio-summary-optimized-filter-controller"
            filterOptions={filterOptions}
            selectedFilters={filters}
            setSelectedFilters={setFilters}
            isLoadingMetricsCatalog={isGlobalLoading}
            testId="portfolio-summary-optimized-filter-controller"
            defaultFilters={defaultFilters}
            disableSubFilterPortal
          />
        </div>

        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <Label
            htmlFor="portfolio-summary-optimized-my-coverage-only"
            className="text-sm font-normal text-muted-foreground whitespace-nowrap"
          >
            My Coverage Only
          </Label>
          <Switch
            data-testid="portfolio-summary-optimized-my-coverage-switch"
            id="portfolio-summary-optimized-my-coverage-only"
            className="scale-90"
            checked={showMyCoverageOnly}
            onCheckedChange={handleMyCoverageToggle}
          />
        </div>
      </div>

      <WidgetBody data-testid="portfolio-summary-optimized-table-body">
        <div className="border-top-no-radius winners-losers-table-ag-grid flex size-full flex-col">
          <DataGrid
            gridRef={gridRef}
            layout={dataGridLayout}
            rowData={rows}
            columnDefs={columns}
            loading={isLoading}
            autoSizeStrategy={autoSizeStrategy}
            autoGroupColumnDef={autoGroupColumnDef}
            getDataPath={getDataPath}
            getRowId={getRowId}
            tooltipShowDelay={0}
            tooltipHideDelay={600000}
            quickFilterText={searchQueryValue}
            {...defaultDataGridProps}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const PortfolioSummaryOptimized = withAppInsights(
  PortfolioSummaryOptimizedContent,
  "PortfolioSummaryOptimized"
);
