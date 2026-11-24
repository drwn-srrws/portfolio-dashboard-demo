import { useMemo } from "react";
import {
  useGetEventMetrics,
  useGetEventMetricsCatalog,
} from "@api/endpoints/event/event";
import { MetricRequest } from "@api/types/index";
import { omitBy } from "@utils/omit";
import { addDays } from "date-fns";
import { hyphenatedDate } from "@/utils/dates";

import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import Table from "./componets/Table";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useSharedFilters } from "@/hooks/useSharedFilters";

interface UpcomingEventsProps {
  additionalMetricFlags?: Record<string, unknown>;
}

const UpcomingEventsContent = ({
  additionalMetricFlags,
}: UpcomingEventsProps) => {
  const { filters: sharedFilters } = useSharedFilters();
  const { metricFlags: defaultMetricFlags } = useMetricFlags();

  const { start, end } = useMemo(() => {
    const today = new Date();
    const start = hyphenatedDate(today);
    const end = hyphenatedDate(addDays(today, 13));
    return { start, end };
  }, []);

  const metricsRequest: MetricRequest = useMemo(
    () => ({
      metrics: [
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
          name: "event_estimate_upside_price_move_percent",
        },
        {
          name: "event_estimate_downside_price_move_percent",
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
      ],
      start_date: start,
      end_date: end,
      filters: omitBy(sharedFilters, (item) => !item.length),
      group_by: ["date", "_event_id"],
    }),
    [start, end, sharedFilters]
  );

  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetEventMetricsCatalog(defaultMetricFlags);

  const summaryMetricsRequest: MetricRequest = useMemo(
    () => ({
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
      start_date: start,
      end_date: end,
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [start, end, sharedFilters]
  );

  const eventMetricsFlags = useMemo(() => {
    return {
      ...defaultMetricFlags,
      ...additionalMetricFlags,
    };
  }, [defaultMetricFlags, additionalMetricFlags]);

  const { data: summaryData } = useGetEventMetrics(
    [summaryMetricsRequest],
    eventMetricsFlags,
    {
      query: {
        enabled: !!metricsCatalogData,
      },
    }
  );

  const { data: events, isLoading: isLoadingEvents } = useGetEventMetrics(
    [metricsRequest],
    eventMetricsFlags,
    {
      query: {
        enabled: !!metricsCatalogData,
      },
    }
  );

  const formattedData = useMemo(() => {
    const eventsData = events?.[0]?.data || [];
    const summaryStats = summaryData?.[0]?.data?.[0] || {};

    return {
      data: eventsData.map((event, index) => ({
        ...event,
        event_id: index,
      })),
      stats: summaryStats,
    };
  }, [events, summaryData]);

  const isLoading = useMemo(
    () => isLoadingCatalog || isLoadingEvents,
    [isLoadingCatalog, isLoadingEvents]
  );

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle>Events</WidgetTitle>
        <WidgetActions>
          <WidgetMaximizeButton />
        </WidgetActions>
      </WidgetHeader>

      <WidgetBody data-testid="events-table-body" className="h-full">
        <div className="flex flex-col gap-4 h-full">
          <Table
            data={formattedData.data}
            metricsCatalogData={metricsCatalogData}
            isLoading={isLoading}
          />
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const UpcomingEvents = withAppInsights(
  UpcomingEventsContent,
  "UpcomingEvents"
);
