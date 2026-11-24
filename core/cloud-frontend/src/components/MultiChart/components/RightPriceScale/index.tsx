import { IDockviewPanelProps } from "dockview-react";
import {
  ISeriesApi,
  Time,
  LineSeries as LineSeriesDef,
  HistogramSeries,
  LineStyle,
} from "lightweight-charts";
import { useEffect, useState } from "react";

import { formatMetric } from "@/utils/metrics";

import { useChartContext } from "../../context/MultiChartContext";
import { ExtendedLineData } from "../..";
import { MetricDisplayType } from "@/api/types";

interface ExtendedSeriesApi extends ISeriesApi<"Line"> {
  extra?: { time: Time; tooltip?: string }[];
}

interface ExtendedHistogramSeriesApi extends ISeriesApi<"Histogram"> {
  extra?: { time: Time; tooltip?: string }[];
}

export interface LineSeriesProps {
  data: ExtendedLineData[];
  volumeData?: ExtendedLineData[];
  color?: string;
  metricType?: string;
  maxVisibleItems: number;
  panelProps?: IDockviewPanelProps;
  contentOffset?: number;
  shouldUseDashedStyle?: boolean;
}

export const RightPriceScale = ({
  data,
  volumeData = [],
  color,
  metricType = "default",
  shouldUseDashedStyle = false,
  panelProps,
  contentOffset = 0,
  maxVisibleItems,
}: LineSeriesProps) => {
  const { chartApi, chartRef } = useChartContext();

  const [lineSeriesApi, setLineSeriesApi] = useState<ExtendedSeriesApi | null>(
    null
  );
  const [volumeSeries, setVolumeSeries] =
    useState<ExtendedHistogramSeriesApi | null>(null);

  const panelHeight = Math.abs(
    (panelProps?.api?.height || 300) - 80 - contentOffset
  );

  useEffect(() => {
    const lineSeriesApi = chartApi.addSeries(LineSeriesDef, {
      priceScaleId: "right",
      color: color || "#FFFFFF",
      lineWidth: shouldUseDashedStyle ? 2 : 1,
      lineStyle: shouldUseDashedStyle ? LineStyle.LargeDashed : LineStyle.Solid,
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
  }, [metricType, chartApi, chartRef, color, data, shouldUseDashedStyle]);

  useEffect(() => {
    if (!lineSeriesApi) return;
    lineSeriesApi.setData(data);
  }, [data, lineSeriesApi]);

  useEffect(() => {
    if (!chartApi) return;

    chartApi.applyOptions({
      autoSize: false,
      height: panelHeight,
      layout: {
        fontSize: 9,
      },
    });

    chartApi.timeScale().fitContent();
  }, [chartApi, maxVisibleItems, panelHeight]);

  useEffect(() => {
    if (!lineSeriesApi || !volumeData.length) return;

    const newVolumeSeries = chartApi.addSeries(HistogramSeries, {
      color: color || "#FFFFFF",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
      priceLineVisible: false,
      lastValueVisible: false,
    }) as ExtendedHistogramSeriesApi;

    newVolumeSeries.extra =
      volumeData.map((item) => ({ time: item.time, tooltip: item.tooltip })) ||
      [];

    newVolumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.96,
        bottom: 0,
      },
      ticksVisible: false,
    });

    setVolumeSeries(newVolumeSeries);

    chartApi.timeScale().fitContent();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (!chartRef.current.isRemoved) {
        chartApi.removeSeries(newVolumeSeries);
      }
    };
  }, [chartApi, chartRef, color, lineSeriesApi, volumeData]);

  useEffect(() => {
    if (!volumeSeries) return;
    volumeSeries.setData(volumeData);
  }, [volumeData, volumeSeries]);

  return null;
};
