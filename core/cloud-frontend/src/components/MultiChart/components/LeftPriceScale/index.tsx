import { ISeriesApi, LineSeries, LineStyle, Time } from "lightweight-charts";
import { useEffect, useState } from "react";

import { formatMetric } from "@/utils/metrics";

import { useChartContext } from "../../context/MultiChartContext";
import { ExtendedLineData } from "../..";
import { MetricDisplayType } from "@/api/types";

interface ExtendedSeriesApi extends ISeriesApi<"Line"> {
  extra?: { time: Time; tooltip?: string }[];
}

export interface LineSeriesProps {
  data: ExtendedLineData[];
  color?: string;
  metricType?: string;
}

export const LeftPriceScale = ({
  data,
  color,
  metricType = "default",
}: LineSeriesProps) => {
  const { chartApi, chartRef } = useChartContext();

  const [lineSeriesApi, setLineSeriesApi] = useState<ExtendedSeriesApi | null>(
    null
  );

  useEffect(() => {
    const lineSeriesApi = chartApi.addSeries(LineSeries, {
      priceScaleId: "left",
      color: color || "#FFFFFF",
      lineWidth: 2,
      lineStyle: LineStyle.LargeDashed,
      lastValueVisible: false,
      priceLineVisible: false,
      priceFormat: {
        type: "custom",
        formatter: (value: string) =>
          formatMetric(value, metricType as MetricDisplayType),
      },
    }) as ExtendedSeriesApi;

    lineSeriesApi.extra =
      data.map((item) => ({ time: item.time, tooltip: item.tooltip })) || [];

    setLineSeriesApi(lineSeriesApi);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (!chartRef.current.isRemoved) {
        chartApi.removeSeries(lineSeriesApi);
      }
    };
  }, [metricType, chartApi, chartRef, color, data]);

  useEffect(() => {
    if (!lineSeriesApi) return;
    lineSeriesApi.setData(data);
  }, [data, lineSeriesApi]);

  return null;
};
