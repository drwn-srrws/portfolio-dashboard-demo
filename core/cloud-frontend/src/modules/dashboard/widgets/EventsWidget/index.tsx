import { useCallback, useMemo, useRef, useState } from "react";
import {
  useGetEventMetrics,
  useGetEventMetricsCatalog,
} from "@api/endpoints/event/event";
import { MetricRequest } from "@api/types/index";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { omitBy } from "@utils/omit";

import { BadgeMultiSelect } from "@components/BadgeMultiSelect";
import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import Table from "./componets/Table";
import {
  availablePeriods,
  getCurrentPeriod,
  getDateRangeByQuarter,
  Period,
} from "./utils";
import { Selectable } from "@/typings/Selectable";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { GridApi } from "@ag-grid-community/core";
import { exportDatagridToCSV } from "@/components/Datagrid/helpers/exportToCSV";
import WidgetRefetchButton from "@/components/Widget/WidgetRefetchButton";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

const defaultPeriods = [getCurrentPeriod()?.value || availablePeriods[0].value];

interface EventsWidgetProps {
  additionalMetricFlags?: Record<string, unknown>;
}

const EventsWidgetContent = ({ additionalMetricFlags }: EventsWidgetProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags: defaultMetricFlags } = useMetricFlags();
  const { isFeatureEnabled } = useFeatureFlags();
  const isIvolEnabled = isFeatureEnabled("enableIvolImpliedMove");

  const [selectedPeriod, setSelectedPeriod] =
    useState<Selectable["value"][]>(defaultPeriods);

  const dateRanges = useMemo(
    () =>
      selectedPeriod.map((period) => {
        const matchingPeriod = availablePeriods.find((p) => p.value === period);

        const year = matchingPeriod?.year;
        const quarter = matchingPeriod?.quarter;

        if (!year || !quarter) return;

        return getDateRangeByQuarter(quarter, year);
      }),
    [selectedPeriod]
  );

  const metricsRequests: MetricRequest[] = useMemo(
    () =>
      dateRanges.map((dateRange) => ({
        metrics: [
          {
            name: "event_is_passed",
          },
          {
            name: "primary_analyst_avatar",
          },
          {
            name: "company_security_code_portfolio_asset_class",
          },
          {
            name: "_event_id",
          },
          {
            name: "_event_estimate_id",
          },
          {
            name: "event_name",
          },
          {
            name: "event_estimate_last_updated_date",
          },
          {
            name: "event_estimate_upside_price_move_percent",
          },
          {
            name: "event_estimate_downside_price_move_percent",
          },
          {
            name: "event_estimate_upside_nav_impact",
          },
          {
            name: "event_estimate_downside_nav_impact",
          },
          {
            name: "event_estimate_up_down_ratio",
          },
          {
            name: "event_estimate_upside_probability",
          },
          {
            name: "all_estimates",
          },
          {
            name: "event_estimate_1_week_actual_nav_impact",
          },
          {
            name: "event_estimate_2_week_actual_nav_impact",
          },
          {
            name: "event_estimate_4_week_actual_nav_impact",
          },
          {
            name: "event_start_date",
          },
          {
            name: "event_end_date",
          },
          {
            name: "event_horizon_type",
          },
          ...(isIvolEnabled
            ? [
                { name: "event_ivol_range_implied_move_upside" },
                { name: "event_ivol_range_implied_move_downside" },
                { name: "event_ivol_upside_probability" },
                { name: "event_ivol_as_of_dt" },
                { name: "event_ivol_analyst_stoplights" },
                { name: "event_ivol_implied_pnl_upside" },
                { name: "event_ivol_implied_pnl_downside" },
              ]
            : []),
        ],
        start_date: dateRange?.start as string,
        end_date: dateRange?.end as string,
        filters: omitBy(sharedFilters, (item) => !item.length),
        group_by: ["date", "_event_id"],
      })),
    [dateRanges, sharedFilters, isIvolEnabled]
  );

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetEventMetricsCatalog(defaultMetricFlags);

  const summaryMetricsRequest: MetricRequest[] = useMemo(
    () =>
      dateRanges.map((dateRange) => ({
        metrics: [
          {
            name: "event_num_events",
          },
          {
            name: "event_num_wins",
          },
          {
            name: "event_num_losses",
          },
          {
            name: "event_win_percentage",
          },
          {
            name: "event_loss_percentage",
          },
        ],
        start_date: dateRange?.start as string,
        end_date: dateRange?.end as string,
        filters: omitBy(sharedFilters, (item) => !item.length),
      })),
    [dateRanges, sharedFilters]
  );

  const eventMetricsFlags = {
    ...defaultMetricFlags,
    ...additionalMetricFlags,
  };

  const { data: summaryData, refetch: refetchSummary } = useGetEventMetrics(
    summaryMetricsRequest,
    eventMetricsFlags,
    {
      query: {
        enabled: !!metricsCatalogData,
      },
    }
  );

  const {
    data: events,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useGetEventMetrics(metricsRequests, eventMetricsFlags, {
    query: {
      enabled: !!metricsCatalogData,
    },
  });

  const { isLoading: isInvalidatingSummary, refetch: invalidateSummary } =
    useGetEventMetrics(
      summaryMetricsRequest,
      { ...eventMetricsFlags, invalidate_cache: true },
      {
        query: { enabled: false },
      }
    );

  const { isLoading: isInvalidatingEvents, refetch: invalidateEvents } =
    useGetEventMetrics(
      metricsRequests,
      { ...eventMetricsFlags, invalidate_cache: true },
      {
        query: { enabled: false },
      }
    );

  const isInvalidating =
    isInvalidatingSummary || isInvalidatingEvents || isLoadingCatalog;

  const onRefetch = useCallback(async () => {
    await invalidateSummary();
    await invalidateEvents();
    await Promise.all([refetchSummary(), refetchEvents()]);
  }, [invalidateSummary, invalidateEvents, refetchSummary, refetchEvents]);

  const formattedDataByQuarter = useMemo(() => {
    return (
      events?.map((quarterEvents, index) => {
        const eventsData = quarterEvents?.data || [];
        const summaryStats = summaryData?.[index]?.data?.[0] || {};

        const period = availablePeriods.find(
          (item) => item.value === selectedPeriod[index]
        ) as Period;

        return {
          quarter: period?.quarter,
          year: period?.year,
          data: eventsData.map((event, index) => ({
            ...event,
            event_id: index,
          })),
          stats: summaryStats,
        };
      }) || []
    );
  }, [events, summaryData, selectedPeriod]);

  const isLoading = useMemo(
    () => isLoadingCatalog || isLoadingEvents,
    [isLoadingCatalog, isLoadingEvents]
  );
  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle
          {...{
            exportToCSV: (name) => exportDatagridToCSV(gridRef, name),
          }}
        >
          Events
        </WidgetTitle>
        <WidgetActions>
          <WidgetRefetchButton
            onRefetch={onRefetch}
            isRefreshing={isInvalidating}
          />
          <SkeletonWrapper
            isLoading={isLoadingCatalog}
            skeletonClassName="h-9 w-[128px]"
          >
            <BadgeMultiSelect
              disablePortal
              testId="events-group-by-select"
              placeholder="Select Quarter"
              alwaysShowPlaceholder={true}
              onChange={(value: Selectable["value"][] | undefined) =>
                setSelectedPeriod(value || [])
              }
              value={selectedPeriod}
              key="period"
              options={availablePeriods}
              handleReset={() => setSelectedPeriod(defaultPeriods)}
              maxBadges={4}
            />
          </SkeletonWrapper>
          <WidgetMaximizeButton />
        </WidgetActions>
      </WidgetHeader>

      <WidgetBody data-testid="events-table-body">
        <div className="flex size-full flex-col gap-4 h-[40rem] md:h-full">
          {isLoading ? (
            <>
              {dateRanges.map((_, index) => (
                <Skeleton key={`skeleton-${index}`} className="w-full flex-1" />
              ))}
            </>
          ) : (
            formattedDataByQuarter.map(({ quarter, year, data, stats }) => (
              <Table
                gridRef={gridRef}
                key={`${year}-Q${quarter}`}
                quarter={quarter}
                year={year}
                data={data}
                stats={stats}
                metricsCatalogData={metricsCatalogData}
                isIvolEnabled={isIvolEnabled}
              />
            ))
          )}
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const EventsWidget = withAppInsights(
  EventsWidgetContent,
  "EventsWidget"
);
