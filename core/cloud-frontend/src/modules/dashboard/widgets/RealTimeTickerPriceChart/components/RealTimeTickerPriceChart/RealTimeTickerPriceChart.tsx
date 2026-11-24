import { MetricChart } from "@/components/MetricChart";
import { createMetricChartSeries, IMetricChartDataItem } from "@/utils/charts";
import { format, fromUnixTime } from "date-fns";
import { Time } from "lightweight-charts";
import { useMemo } from "react";
import {
  DateRange,
  mapDateRangeToMetric,
} from "../RealTimeTickerPriceChartContent/constants";
import { NoDataOverlay } from "@/components/Overlay/NoDataOverlay";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IntradayBar,
  mapCompanyDataToChartData,
} from "../RealTimeTickerPriceChartContent/utils";
import { PaginatedCompanyResponse } from "@/api/types";
import { useInstrumentSocket } from "@/hooks/useInstrumentSocket";

export const RealTimeTickerPriceChart = ({
  companiesData,
  intradayBarsData,
  pending,
  loading,
  selectedDateRange,
}: {
  companiesData?: PaginatedCompanyResponse;
  intradayBarsData?: IntradayBar[];
  pending: boolean;
  loading: boolean;
  selectedDateRange: DateRange;
}) => {
  const { serverData: realtimePriceData } = useInstrumentSocket({
    url: "/api/dev/instrument/get-realtime-ticks",
    instrumentIds:
      (intradayBarsData as IntradayBar[])?.map((bar) => bar.instrument_id) ||
      [],
  });

  const chartData: IMetricChartDataItem[] = useMemo(() => {
    if (!companiesData) return [];

    return mapCompanyDataToChartData({
      companiesData,
      metric: mapDateRangeToMetric(selectedDateRange),
      intradayBarsData: (intradayBarsData as IntradayBar[]) || [],
      realtimePriceData: realtimePriceData || [],
      dateRange: selectedDateRange,
    });
  }, [companiesData, selectedDateRange, intradayBarsData, realtimePriceData]);

  const chartDataSeries = useMemo(() => {
    return createMetricChartSeries(chartData, "dollars_regular");
  }, [chartData]);

  const timeFormatter = useMemo(() => {
    return selectedDateRange === "DTD"
      ? (time: Time) => format(fromUnixTime(Number(time)), "HH:mm:ss")
      : undefined;
  }, [selectedDateRange]);

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
            tickMarkFormatter: timeFormatter,
          }}
        />
      )}
    </>
  );
};
