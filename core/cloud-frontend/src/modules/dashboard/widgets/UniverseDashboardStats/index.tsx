import { useMemo } from "react";
import { Skeleton } from "@components/ui/skeleton";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { useListCompaniesV2 } from "@hooks/api/useListCompaniesV2";
import { useRetrieveCompanyCatalog } from "@api/endpoints/company/company";
import { MetricCard } from "@/components/MetricCard";
import { useIsMobile } from "@/hooks/useMobile";
import { WidgetWrapper } from "@/components/Widget/WidgetWrapper";
import { WidgetBody } from "@/components/Widget/WidgetBody";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CompanyCatalogRequestFilters,
  CompanyIncludes,
  CompanyLogicalFilterFiltersItem,
  LogicalOperator,
  PaginatedCompanyResponse,
} from "@/api/types";
import { mapMetricsValuesToCards } from "../MetricCards/MetricCards.utils";
import {
  STATS_METRICS,
  convertCatalogToMetrics,
} from "./UniverseDashboardStats.utils";

interface UniverseDashboardStatsContentProps {
  defaultFilters: CompanyCatalogRequestFilters[];
  includes: CompanyIncludes[];
}

const UniverseDashboardStatsContent = ({
  defaultFilters: defaultAdvancedFilter,
  includes,
}: UniverseDashboardStatsContentProps) => {
  const isMobile = useIsMobile();

  const defaultFilters = (
    defaultAdvancedFilter && defaultAdvancedFilter.length > 0
      ? defaultAdvancedFilter.filter(Boolean)
      : []
  ) as CompanyLogicalFilterFiltersItem[];

  const companiesResponse = useListCompaniesV2({
    page: 1,
    page_size: 1,
    sort_by: "name",
    sort_order: "asc",
    includes: includes,
    filter: {
      op: LogicalOperator.and,
      filters: [...defaultFilters],
    },
  });

  const catalogResponse = useRetrieveCompanyCatalog(
    {
      filters: {
        op: LogicalOperator.and,
        filters: [...defaultFilters],
      },
    },
    undefined,
    {
      query: {
        enabled: true,
      },
    }
  );

  const stats = (companiesResponse.data as PaginatedCompanyResponse)?.stats;
  const catalogData = catalogResponse.data;

  const metricsCatalog = useMemo(
    () => convertCatalogToMetrics(catalogData),
    [catalogData]
  );
  const metricCards = useMemo(
    () =>
      stats
        ? mapMetricsValuesToCards(STATS_METRICS, stats, metricsCatalog)
        : [],
    [stats, metricsCatalog]
  );

  const isLoading = companiesResponse.isLoading || catalogResponse.isLoading;
  const hasError = companiesResponse.isError || catalogResponse.isError;

  const renderMetricCard = (
    item: ReturnType<typeof mapMetricsValuesToCards>[0]
  ) => {
    const description = metricsCatalog.find(
      (cat) => cat.name === item.name
    )?.description;

    return (
      <div className="flex-1" key={item.name}>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div>
                {" "}
                <MetricCard {...item} isDynamicFontColoringEnabled={false} />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-800 text-white p-2 rounded max-w-[30rem] break-words border border-neutral-600 shadow-md">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <WidgetWrapper
      className="flex h-fit w-full gap-3 border-none !p-0"
      testId="universe-dashboard-stats-widget"
    >
      {isLoading ? (
        <div className={`flex ${isMobile ? "flex-col" : ""} gap-3 w-full`}>
          {STATS_METRICS.map((_, index) => (
            <Skeleton
              key={index}
              className={`w-full ${isMobile ? "h-12" : "h-8"}`}
            />
          ))}
        </div>
      ) : (
        <WidgetBody className="flex w-full flex-col gap-3 h-full">
          <div
            className={`flex ${isMobile ? "flex-col" : ""} w-full gap-3 overflow-y-auto`}
          >
            {hasError ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-red-400">
                  Failed to load statistics
                </p>
              </div>
            ) : metricCards.length > 0 ? (
              metricCards.map(renderMetricCard)
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-neutral-400">No data available</p>
              </div>
            )}
          </div>
        </WidgetBody>
      )}
    </WidgetWrapper>
  );
};

export const UniverseDashboardStats = withAppInsights(
  UniverseDashboardStatsContent,
  "UniverseDashboardStats"
);
