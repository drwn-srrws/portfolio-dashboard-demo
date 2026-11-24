import { MetricChart } from "@/components/MetricChart";
import { createMetricChartSeries, IMetricChartDataItem } from "@/utils/charts";
import { useMemo } from "react";
import {
  DateRange,
  MetricType,
  mapDateRangeToMetric,
} from "../TimeSeriesChartContent/constants";
import { NoDataOverlay } from "@/components/Overlay/NoDataOverlay";
import { Skeleton } from "@/components/ui/skeleton";
import { mapCompanyDataToChartData } from "../TimeSeriesChartContent/utils";
import { PaginatedCompanyResponse } from "@/api/types";

export const TimeSeriesChart = ({
  companiesData,
  pending,
  loading,
  selectedDateRange,
  selectedMetricType,
}: {
  companiesData?: PaginatedCompanyResponse;
  pending: boolean;
  loading: boolean;
  selectedDateRange: DateRange;
  selectedMetricType: MetricType;
}) => {
  const chartData: IMetricChartDataItem[] = useMemo(() => {
    if (!companiesData) return [];

    return mapCompanyDataToChartData({
      companiesData,
      metric: mapDateRangeToMetric(selectedDateRange, selectedMetricType),
    });
  }, [companiesData, selectedDateRange, selectedMetricType]);

  const chartDataSeries = useMemo(() => {
    return createMetricChartSeries(chartData, "dollars_regular");
  }, [chartData]);

  return (
    <>
      {loading || (pending && !chartData.length) ? (
        <Skeleton className="size-full" />
      ) : !chartData.length || !chartDataSeries?.length ? (
        <NoDataOverlay />
      ) : (
        <MetricChart
          data={chartDataSeries}
          pending={pending}
          timeScale={{
            timeVisible: true,
            secondsVisible: false,
            borderColor: "transparent",
          }}
        />
      )}
    </>
  );
};
