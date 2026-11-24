import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { startOfYear, subMonths } from "date-fns";
import { WidgetActions } from "@components/Widget/WidgetActions";
import { WidgetBody } from "@components/Widget/WidgetBody";
import { WidgetHeader } from "@components/Widget/WidgetHeader";
import WidgetMaximizeButton from "@components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "@components/Widget/WidgetTitle";
import { WidgetWrapper } from "@components/Widget/WidgetWrapper";
import { Filters } from "@/typings/Filters";
import { Separator } from "@components/ui";
import { Sort } from "@typings/Sort";
import { GridApi } from "@ag-grid-community/core";
import { EventsMonitorGrid } from "../EventsMonitorGrid";
import { SearchField } from "../SearchField";
import { Pagination } from "@/components/Pagination";
import { debounce, hyphenatedDate } from "@/utils";
import { useIsMobile } from "@/hooks/useMobile";

import { useSharedFilters } from "@/hooks/useSharedFilters";
import {
  CompanySort,
  CompanyFilterField,
  ComparisonOperator,
  LogicalOperator,
  CompanyListRequestSortBy,
} from "@api/types";
import { useEventsMonitor } from "../../hooks/useEventsMonitor";
import { useSequentialModals } from "../../hooks/useSequentialModals";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";
import { useReloadCache } from "../../hooks/useReloadCache";
import { EventDetailDialog } from "../../dialogs/EventDetailDialog/EventDetailDialog";
import { EstimateDialog } from "../../dialogs/EstimateDialog";
import { PassedEventsDialog } from "../../dialogs/PassedEventsDialog";
import { StaleEstimatesDialog } from "../../dialogs/StaleEstimatesDialog";
import { ColumnSelect } from "../ColumnSelect";
import { FilterToggle } from "../FilterToggle";
import { exportEventsMonitorToCSV } from "../../utils/exportToCSV";
import { toast } from "@components/ui/use-toast";
import { listEventTracker } from "@/api/endpoints/event-tracker/event-tracker";
import { getSortBy } from "../../constants/columnSortMap";
import {
  toggleFilters,
  columnOptions,
  defaultSelectedColumns,
  toggleOptions,
} from "../../constants/eventsMonitorConstants";
import { useChangeHistory } from "../../../../providers/ChangeHistoryProvider";
import { RefreshButton } from "../../../../components/RefreshButton";
import { PendingChangesDialog } from "@/modules/dashboard/dialogs/PendingChangesDialog";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getLookbackDate = (): string => {
  const today = new Date();
  const yearStart = startOfYear(today);
  const threeMonthsAgo = subMonths(today, 3);

  const lookbackDate = yearStart < threeMonthsAgo ? yearStart : threeMonthsAgo;

  return hyphenatedDate(lookbackDate);
};

export interface EventsMonitorContentProps {
  metrics?: string[];
  defaultFilter?: Filters;
}

export const EventsMonitorContent = () => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<Sort<CompanySort> | null>(null);
  const [toggleState, setToggleState] = useState<"inPortfolio" | "flagged">(
    "inPortfolio"
  );
  const [isExportingAll, setIsExportingAll] = useState(false);

  const { filters: sharedFilters } = useSharedFilters();
  const gridRef = useRef<GridApi | null>(null);
  const isMobile = useIsMobile();
  const { history } = useChangeHistory();
  const { updateDialog } = useStore();
  const { account } = useAuth();
  const readOnly = isPortfolioManagerReadOnly(account?.roles);

  const debouncedSetSearchQueryRef = useRef(
    debounce((value: string) => {
      setSearchQuery(value);
      setPage(1);
    }, 300)
  );

  const { isPassedEventsLoading, isStaleEstimatesLoading } =
    useSequentialModals({ disabled: readOnly });

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    defaultSelectedColumns
  );

  const defaultFilters = useMemo(() => {
    return [
      {
        op: LogicalOperator.and,
        filters: [
          {
            field: CompanyFilterField.eventsdate,
            op: ComparisonOperator.gte,
            value: getLookbackDate(),
          },
          toggleFilters[toggleState],
        ],
      },
    ];
  }, [toggleState]);

  const eventsMonitorQuery = useEventsMonitor({
    page,
    page_size: 100,
    sort_by: getSortBy(sort?.key ?? "") as CompanyListRequestSortBy,
    sort_order: sort?.order ?? "asc",
    searchQuery: searchQuery,
    defaultFilters,
    sharedFilters: sharedFilters,
    enabled: !isPassedEventsLoading && !isStaleEstimatesLoading,
  });

  const invalidateCacheEventsMonitorQuery = useEventsMonitor({
    page,
    page_size: 100,
    sort_by: getSortBy(sort?.key ?? "") as CompanyListRequestSortBy,
    sort_order: sort?.order ?? "asc",
    searchQuery: searchQuery,
    defaultFilters,
    sharedFilters: sharedFilters,
    invalidate_cache: true,
    enabled: false,
  });

  const {
    data,
    isLoading,
    isPlaceholderData,
    request: baseRequest,
  } = eventsMonitorQuery;

  const { isRefetching, handleReload: handleReloadData } = useReloadCache({
    eventsMonitorQuery: invalidateCacheEventsMonitorQuery,
    onClose: useCallback(() => {
      updateDialog({
        dialog: Dialogs.openPendingChangesDialog,
        status: false,
      });
    }, [updateDialog]),
  });

  const companies = useMemo(() => data?.items ?? [], [data]);
  const totalPages = useMemo(() => data?.total_pages ?? 1, [data]);
  const total = data?.total ?? 0;

  const handleRefreshClick = useCallback(() => {
    updateDialog({
      dialog: Dialogs.openPendingChangesDialog,
      status: true,
    });
  }, [updateDialog]);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInputValue(value);
    debouncedSetSearchQueryRef.current(value);
  }, []);

  const handleColumnsChange = useCallback(
    (columns: (string | number | boolean)[]) => {
      setSelectedColumns(columns as string[]);
    },
    []
  );

  const handleColumnsReset = useCallback(() => {
    setSelectedColumns(defaultSelectedColumns);
  }, []);

  const handleToggleChange = useCallback((value: string) => {
    setToggleState(value as "inPortfolio" | "flagged");
    setPage(1);
  }, []);

  const exportToCSV = useCallback(
    (name: string) => {
      exportEventsMonitorToCSV(gridRef, companies, name);
    },
    [companies]
  );

  const exportAllToCSV = useCallback(
    async (name: string) => {
      if (!total) return;
      setIsExportingAll(true);
      try {
        const response = await listEventTracker({
          ...baseRequest,
          page: 1,
          page_size: total,
        });
        exportEventsMonitorToCSV(gridRef, response.items, name);
      } catch {
        toast({
          title: "Can't Export to CSV",
          description:
            "There was an error fetching the data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsExportingAll(false);
      }
    },
    [total, baseRequest]
  );

  return (
    <WidgetWrapper
      data-testid={
        isLoading || isPassedEventsLoading || isStaleEstimatesLoading
          ? "events-monitor-widget-wrapper-loading"
          : "events-monitor-widget-wrapper"
      }
    >
      <WidgetHeader>
        <WidgetTitle
          exportToCSV={exportToCSV}
          exportAllToCSV={exportAllToCSV}
          isExportingAll={isExportingAll}
        >
          AS Team Dashboard
        </WidgetTitle>
        <WidgetActions>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <span>
                  <RefreshButton
                    changeCount={history.length}
                    onClick={handleRefreshClick}
                    isRefreshing={isRefetching}
                  />
                </span>
              </TooltipTrigger>
              {isRefetching && (
                <TooltipContent className="bg-neutral-800 text-white border border-neutral-600">
                  <p>
                    We're refreshing the data and your page will be updated
                    momentarily.
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <WidgetMaximizeButton />

          <ColumnSelect
            value={selectedColumns}
            options={columnOptions}
            onChange={handleColumnsChange}
            handleReset={handleColumnsReset}
            isMobile={isMobile}
          />

          <FilterToggle
            value={toggleState}
            onValueChange={handleToggleChange}
            options={toggleOptions}
            isMobile={isMobile}
          />
        </WidgetActions>
      </WidgetHeader>

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <SearchField
            value={searchInputValue}
            onChange={handleSearch}
            testId="events-monitor-search-field"
          />
        </div>
      </div>

      <WidgetBody data-testid="events-monitor-table-body">
        <EventsMonitorGrid
          data={companies}
          sort={sort}
          pending={isPlaceholderData}
          loading={
            isLoading || isPassedEventsLoading || isStaleEstimatesLoading
          }
          columns={selectedColumns}
          gridRef={gridRef}
          onSortChange={setSort}
        />
        <Separator />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </WidgetBody>
      {!readOnly && <EventDetailDialog />}
      {!readOnly && <PassedEventsDialog />}
      {!readOnly && <StaleEstimatesDialog />}
      {!readOnly && <EstimateDialog />}

      <PendingChangesDialog
        history={history}
        onReload={handleReloadData}
        isReloading={isRefetching}
      />
    </WidgetWrapper>
  );
};
