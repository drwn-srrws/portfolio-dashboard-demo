import { useMemo } from "react";
import { omitBy } from "@/utils/omit";
import { Skeleton } from "@components/ui/skeleton";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import {
  useGetPortfolioMetricCatalog,
  useGetPortfolioMetrics,
} from "@/api/endpoints/portfolio/portfolio";
import {
  useGetEventMetrics,
  useGetEventMetricsCatalog,
} from "@api/endpoints/event/event";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import {
  mapMetricsValuesToCards,
  mapToMetricsValues,
} from "./MetricCards.utils";
import { filterJunkMetrics, JUNK_METRICS } from "./utils";
import { MetricCard } from "@/components/MetricCard";
import { useDateRange } from "@/providers/DateRangeProvider";
import { useMetricFlags } from "@/providers/MetricFlagsProvider";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useMode } from "@/providers/ModeProvider";
import { useIsMobile } from "@/hooks/useMobile";
import { WidgetWrapper } from "@/components/Widget/WidgetWrapper";
import { WidgetBody } from "@/components/Widget/WidgetBody";

export interface MetricCardsProps {
  metrics: string[];
  isDynamicFontColoringEnabled?: boolean;
  isEventAPI?: boolean;
  additionalMetricFlags?: Record<string, unknown>;
}

const MetricCardsContent = ({
  metrics,
  isDynamicFontColoringEnabled = true,
  isEventAPI = false,
  additionalMetricFlags,
}: MetricCardsProps) => {
  const { metricFlags: defaultMetricFlags } = useMetricFlags();
  const { filters: sharedFilters } = useSharedFilters();
  const { mode } = useMode();
  const isMobile = useIsMobile();

  const isEditMode = mode === "edit" || mode === "create";

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { startDate, endDate } = useDateRange();

  const metricsPayload = useMemo(
    () => ({
      start_date: panelStartDate ?? startDate,
      end_date: panelEndDate ?? endDate,
      metrics: metrics?.map((metric) => ({ name: metric })),
      filters: omitBy(sharedFilters, (item) => !item.length),
    }),
    [panelStartDate, panelEndDate, startDate, endDate, metrics, sharedFilters]
  );

  const eventMetricsCatalogResponse = useGetEventMetricsCatalog(
    defaultMetricFlags,
    {
      query: {
        enabled: isEventAPI,
      },
    }
  );
  const portfolioMetricsCatalogResponse = useGetPortfolioMetricCatalog(
    undefined,
    {
      query: {
        enabled: !isEventAPI,
      },
    }
  );

  const metricFlags = {
    ...defaultMetricFlags,
    ...additionalMetricFlags,
  };

  const metricsCatalogData = isEventAPI
    ? eventMetricsCatalogResponse.data
    : portfolioMetricsCatalogResponse.data;

  const isLoadingCatalog = isEventAPI
    ? eventMetricsCatalogResponse.isLoading
    : portfolioMetricsCatalogResponse.isLoading;

  const metricsCatalog = useMemo(() => {
    return metricsCatalogData?.metrics || [];
  }, [metricsCatalogData]);

  const eventMetricsResponse = useGetEventMetrics(
    [metricsPayload],
    metricFlags,
    {
      query: {
        enabled: isEventAPI && !!eventMetricsCatalogResponse.data,
      },
    }
  );

  const portfolioMetricsResponse = useGetPortfolioMetrics(
    [metricsPayload],
    undefined,
    {
      query: {
        enabled: !isEventAPI && !!portfolioMetricsCatalogResponse.data,
      },
    }
  );

  const metricsData = isEventAPI
    ? eventMetricsResponse.data
    : portfolioMetricsResponse.data;

  const isLoadingMetrics = isEventAPI
    ? eventMetricsResponse.isLoading
    : portfolioMetricsResponse.isLoading;

  const portfolioMetrics = useMemo(() => metricsData || [], [metricsData]);

  const metricsValues = useMemo(
    () => mapToMetricsValues(portfolioMetrics),
    [portfolioMetrics]
  );

  const metricsCards = useMemo(
    () =>
      filterJunkMetrics(
        mapMetricsValuesToCards(metrics, metricsValues, metricsCatalog),
        JUNK_METRICS
      ),
    [metrics, metricsValues, metricsCatalog]
  );

  const isLoading = isLoadingCatalog || isLoadingMetrics;

  return (
    <WidgetWrapper
      className="flex h-fit w-full gap-3 border-none !p-0"
      testId="metric-cards-widget"
    >
      {isLoading ? (
        isMobile ? (
          <div className="flex flex-col gap-3 w-full">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        ) : (
          <div className="flex gap-3 w-full">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
          </div>
        )
      ) : isEditMode ? (
        <WidgetBody className="flex w-full flex-col gap-3 h-full">
          <div className="flex items-center justify-between gap-2">
            {isEditMode && <WidgetTitle>Metrics</WidgetTitle>}
          </div>
          <div className="flex w-full gap-3 overflow-y-auto">
            {metricsCards.length > 0 ? (
              metricsCards?.map((item) => (
                <div className="flex-1" key={item.name}>
                  <MetricCard
                    {...item}
                    isDynamicFontColoringEnabled={isDynamicFontColoringEnabled}
                  />
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-neutral-400">No metrics found</p>
              </div>
            )}
          </div>
        </WidgetBody>
      ) : (
        <div className="flex flex-col md:flex-row flex-1 gap-3 overflow-y-auto">
          {metricsCards.length > 0 ? (
            metricsCards?.map((item) => (
              <div className="flex-1" key={item.name}>
                <MetricCard
                  {...item}
                  isDynamicFontColoringEnabled={isDynamicFontColoringEnabled}
                />
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-neutral-400">No metrics found</p>
            </div>
          )}
        </div>
      )}
    </WidgetWrapper>
  );
};

export const MetricCards = withAppInsights(MetricCardsContent, "MetricCards");
