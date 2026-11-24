import {
  createChart,
  ISeriesApi,
  LineData,
  LineSeries,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";

import { CompanyPageTrendsResponse, CompanyTrend } from "@api/types/index";

import { seriesConfig, trendOptions } from "../utils";
import { chartOptions } from "./Chart.options";

export interface LineSeriesData {
  id: string;
  data:
    | CompanyPageTrendsResponse["ytd_pnl"]
    | CompanyPageTrendsResponse["price"]
    | CompanyPageTrendsResponse["size"];
  color: string;
  title: string;
  priceScaleId: string;
  initialX: number;
  yKey: CompanyTrend;
}

export interface ChartProps {
  series: LineSeriesData[];
}

export const Chart = ({ series }: ChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [legends, setLegends] = useState<
    { id: string; title: string; color: string }[]
  >([]);

  useEffect(() => {
    if (!ref.current) return;

    const chartInstance = createChart(ref.current, chartOptions);
    const seriesMap: { [key: string]: ISeriesApi<"Line"> } = {};

    series.forEach((s) => {
      if (!s.data) return;

      const lineSeries = chartInstance.addSeries(LineSeries, {
        color: s.color,
        lineWidth: 2,
        priceScaleId: s.priceScaleId,
        priceFormat: {
          type: "custom",
          formatter: seriesConfig[s.yKey].format,
        },
      });

      const dataToSet = s.data
        .map((item) => ({
          time: Math.floor(new Date(item.timestamp).getTime() / 1000),
          value: item.value,
        }))
        .filter((data) => data.value !== undefined) as LineData[];

      lineSeries.setData(dataToSet);
      seriesMap[s.id] = lineSeries;
    });

    setLegends(
      series.map((s) => ({
        id: s.id,
        title:
          trendOptions.find((trend) => trend.value === s.id)?.label || "N/A",
        color: s.color,
      }))
    );

    chartInstance.timeScale().fitContent();

    return () => {
      chartInstance.remove();
    };
  }, [series]);

  return (
    <div className="relative flex size-full max-h-full flex-1 flex-col overflow-hidden">
      <div
        ref={ref}
        className="max-h-full flex-1"
        style={{ maxHeight: "calc(100% - 23px)" }}
      />
      <div className="absolute bottom-0 left-1/2 z-50 flex items-center gap-5">
        {legends.map((legend) => (
          <div key={legend.id} className="flex items-center gap-2">
            <div className="size-4" style={{ backgroundColor: legend.color }} />
            <span>{legend.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
