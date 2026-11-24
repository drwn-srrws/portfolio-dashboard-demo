import { ChangeEvent, useCallback, useMemo, useState } from "react";
import {
  CompanyCatalogRequestFilters,
  CompanyIncludes,
  CompanySort,
} from "@/api/types";
import FilterController from "@/components/FilterController/FilterController";
import { useLocalFilters } from "@/providers/LocalFiltersProvider/LocalFiltersContext";
import { debounce } from "@/utils";
import { WidgetActions } from "@components/Widget/WidgetActions";
import { WidgetBody } from "@components/Widget/WidgetBody";
import { WidgetHeader } from "@components/Widget/WidgetHeader";
import WidgetMaximizeButton from "@components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "@components/Widget/WidgetTitle";
import { WidgetWrapper } from "@components/Widget/WidgetWrapper";
import { Filters } from "@/typings/Filters";
import { Label, Separator } from "@components/ui";
import { Sort } from "@typings/Sort";
import { getFilterOptions } from "../../helpers/getFilterOptions";
import { useCoverageUniverse } from "../../hooks/useCoverageUniverse";
import { CoverageUniverseGrid } from "../CoverageUniverseGrid";
import { SearchField } from "../SearchField";
import { useCompanyCatalog } from "../../hooks/useCompanyCatalog";
import { convertToMetricCatalog } from "../../helpers/convertToMetricCatalog";
import { Pagination } from "@/components/Pagination";

import { useFeatureFlags } from "@hooks/useFeatureFlags";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { CompanyDialog } from "@/modules/data-manager/main/security-manager/dialogs/CompanyDialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { TextSelect } from "@/components/TextSelect";
import { getSortBy } from "../../constants/columnSortMap";
import { useChangeHistory } from "@/modules/dashboard/providers/ChangeHistoryProvider";
import { PendingChangesDialog } from "@/modules/dashboard/dialogs/PendingChangesDialog";
import { useReloadCache } from "../../hooks/useReloadCache";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { RefreshButton } from "@/modules/dashboard/components/RefreshButton";

const PAGE_SIZE = 100;

export interface CoverageUniverseContentProps {
  metrics: string[];
  defaultAdvancedFilter?: CompanyCatalogRequestFilters[];
  defaultFilter?: Filters;
  enabledColumns?: string[];
}

export const CoverageUniverseContent = ({
  metrics,
  defaultAdvancedFilter,
  defaultFilter,
  enabledColumns,
}: CoverageUniverseContentProps) => {
  const { filters, setFilters } = useLocalFilters();
  const { filters: sharedFilters } = useSharedFilters();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<Sort<string> | null>(null);
  const [inPortfolioFilter, setInPortfolioFilter] = useState<boolean>(false);
  const [selectedBenchmark, setSelectedBenchmark] = useState<string | null>(
    null
  );
  const [prevSharedFilters, setPrevSharedFilters] =
    useState<Filters>(sharedFilters);

  const { history, clearHistory } = useChangeHistory();
  const { updateDialog } = useStore();
  const { isFeatureEnabled } = useFeatureFlags();
  const kgEnabled = isFeatureEnabled("enableKgFeatures");

  const includes = useMemo(
    () =>
      Array.from(
        new Set([
          ...metrics,
          "primary_instrument",
          "position_ytd_pnl",
          ...(kgEnabled ? ["drugs"] : []),
        ])
      ) as CompanyIncludes[],
    [metrics, kgEnabled]
  );

  const {
    data: companyCatalogDataWithFilters,
    isLoading: isLoadingCompanyCatalogWithFilters,
  } = useCompanyCatalog(undefined, {
    include_filterable_values: true,
  });

  const { data: companyCatalogData, isLoading: isLoadingCompanyCatalog } =
    useCompanyCatalog(undefined, {
      include_filterable_values: false,
    });

  const filterOptions = useMemo(() => {
    return getFilterOptions(companyCatalogDataWithFilters);
  }, [companyCatalogDataWithFilters]);

  const inPortfolioFilterAvailable = useMemo(() => {
    return filterOptions?.find((filter) => filter.name === "in_portfolio");
  }, [filterOptions]);

  const sortBy = useMemo(
    () => (sort && getSortBy(sort.key)) as CompanySort,
    [sort]
  );

  const coverageUniverseQuery = useCoverageUniverse({
    page,
    page_size: PAGE_SIZE,
    sort_by: (sortBy as CompanySort) ?? undefined,
    sort_order: sort?.order ?? "asc",
    searchQuery,
    defaultFilter: defaultAdvancedFilter || [],
    sharedFilters:
      inPortfolioFilter && inPortfolioFilterAvailable
        ? { ...sharedFilters, in_portfolio: [inPortfolioFilter] }
        : sharedFilters,
    includes,
  });

  const invalidateCacheCoverageUniverseQuery = useCoverageUniverse({
    page,
    page_size: PAGE_SIZE,
    sort_by: (sortBy as CompanySort) ?? undefined,
    sort_order: sort?.order ?? "asc",
    searchQuery,
    defaultFilter: defaultAdvancedFilter || [],
    sharedFilters:
      inPortfolioFilter && inPortfolioFilterAvailable
        ? { ...sharedFilters, in_portfolio: [inPortfolioFilter] }
        : sharedFilters,
    includes,
    invalidate_cache: true,
  });

  const {
    data,
    isLoading: isLoadingCoverageUniverse,
    isPlaceholderData,
  } = coverageUniverseQuery;

  const metricCatalogFields = useMemo(() => {
    return convertToMetricCatalog(companyCatalogData?.fields || []);
  }, [companyCatalogData?.fields]);

  const companies = useMemo(() => data?.items ?? [], [data]);

  // Benchmarks are the keys of the ivol_ratio map, identical across companies,
  // so the first company carrying a reading defines the available options.
  // Sorted so the dropdown order and the fallback default (availableBenchmarks[0])
  // are deterministic — JS object key order from the map isn't guaranteed.
  const availableBenchmarks = useMemo(() => {
    const withRatio = companies.find((company) => company.ivol_ratio);
    return withRatio?.ivol_ratio
      ? Object.keys(withRatio.ivol_ratio).sort()
      : [];
  }, [companies]);

  // Default to the client's configured benchmark (e.g. XBI) when the user
  // hasn't picked one, falling back to the first available only if the
  // configured default has no reading.
  const defaultBenchmark = companyCatalogData?.default_benchmark_index ?? null;

  const activeBenchmark = useMemo(() => {
    if (selectedBenchmark && availableBenchmarks.includes(selectedBenchmark)) {
      return selectedBenchmark;
    }
    if (defaultBenchmark && availableBenchmarks.includes(defaultBenchmark)) {
      return defaultBenchmark;
    }
    return availableBenchmarks[0] ?? null;
  }, [selectedBenchmark, defaultBenchmark, availableBenchmarks]);

  const benchmarkOptions = useMemo(
    () =>
      availableBenchmarks.map((benchmark) => ({
        label: benchmark,
        value: benchmark,
      })),
    [availableBenchmarks]
  );

  const totalPages = useMemo(() => data?.total_pages ?? 1, [data]);

  const { isReloading, handleReload } = useReloadCache({
    coverageUniverseQuery: invalidateCacheCoverageUniverseQuery,
    clearHistory,
    onClose: useCallback(() => {
      updateDialog({
        dialog: Dialogs.openPendingChangesDialog,
        status: false,
      });
    }, [updateDialog]),
  });

  const handleRefreshClick = useCallback(() => {
    updateDialog({
      dialog: Dialogs.openPendingChangesDialog,
      status: true,
    });
  }, [updateDialog]);

  const updateSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        setPage(1);
      }, 500),
    []
  );

  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(event.target.value);
      updateSearchQuery(event.target.value);
    },
    [updateSearchQuery]
  );

  const isLoadingFilters = useMemo(
    () => isLoadingCompanyCatalogWithFilters,
    [isLoadingCompanyCatalogWithFilters]
  );
  const isLoadingGrid = useMemo(
    () => isLoadingCompanyCatalog || isLoadingCoverageUniverse || isReloading,
    [isLoadingCompanyCatalog, isLoadingCoverageUniverse, isReloading]
  );

  if (prevSharedFilters !== sharedFilters) {
    setPrevSharedFilters(sharedFilters);
    setPage(1);
  }

  const handleInPortfolio = useCallback((value: boolean) => {
    setInPortfolioFilter(value);
  }, []);

  return (
    <>
      <WidgetWrapper
        data-testid={
          isLoadingGrid
            ? "coverage-universe-widget-wrapper-loading"
            : "coverage-universe-widget-wrapper"
        }
      >
        <WidgetHeader className="items-start">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full min-w-0">
            <div className="flex items-center gap-4 min-w-0">
              <WidgetTitle>Coverage Universe</WidgetTitle>
              <SearchField
                value={searchInputValue}
                onChange={handleSearch}
                testId="coverage-universe-search-field"
              />
            </div>

            <WidgetActions className="flex-1 justify-end">
              {activeBenchmark && benchmarkOptions.length > 0 ? (
                <div className="flex items-center gap-2">
                  <Label className="block text-nowrap text-base font-normal">
                    iVol Benchmark
                  </Label>
                  <TextSelect
                    disablePortal
                    options={benchmarkOptions}
                    value={activeBenchmark}
                    onChange={(value) => setSelectedBenchmark(`${value}`)}
                    testId="ivol-benchmark-select"
                  />
                </div>
              ) : null}
              <RefreshButton
                changeCount={history.length}
                onClick={handleRefreshClick}
                isRefreshing={isReloading}
              />
            </WidgetActions>
            {isLoadingFilters ? (
              <Skeleton className="w-20 h-10" />
            ) : inPortfolioFilterAvailable ? (
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="in_portfolio"
                  className="block text-nowrap text-base font-normal"
                >
                  Companies in Portfolio
                </Label>
                <Switch
                  data-testid="in_portfolio-switch"
                  id="in_portfolio"
                  className="scale-75"
                  checked={inPortfolioFilter}
                  onCheckedChange={handleInPortfolio}
                />
              </div>
            ) : null}
          </div>

          <WidgetActions>
            <WidgetMaximizeButton />
          </WidgetActions>
        </WidgetHeader>

        <FilterController
          filterOptions={filterOptions}
          selectedFilters={filters}
          setSelectedFilters={setFilters}
          isLoadingMetricsCatalog={isLoadingFilters}
          defaultFilters={defaultFilter}
          testId="coverage-monitor-table-filter-controller"
        />

        <WidgetBody data-testid="coverage-universe-table-body">
          <CoverageUniverseGrid
            data={companies}
            sort={sort}
            pending={isPlaceholderData}
            loading={isLoadingGrid}
            onSortChange={setSort}
            catalogFields={metricCatalogFields}
            enabledColumns={enabledColumns}
            selectedBenchmark={activeBenchmark}
          />
          <Separator />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </WidgetBody>
      </WidgetWrapper>
      <CompanyDialog />
      <PendingChangesDialog
        history={history}
        onReload={handleReload}
        isReloading={isReloading}
      />
    </>
  );
};
