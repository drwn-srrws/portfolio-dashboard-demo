import { IDockviewPanelProps } from "dockview-react";
import { LineData, SolidColor } from "lightweight-charts";
import React, { useCallback, useMemo, useRef, useState } from "react";

import { toast } from "@components/ui/use-toast";
import { Legend } from "./components/Legend";
import { RightPriceScale } from "./components/RightPriceScale";
import { LeftPriceScale } from "./components/LeftPriceScale";
import { ChartTooltip } from "./components/MultiChartTooltip";
import { ChartProvider } from "./context/MultiChartContext";
import { useChart } from "./hooks/useChart";
import { thresholds } from "./utils";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { cn } from "@/utils";
import { MetricCatalogItem } from "@/api/types";

export interface ExtendedLineData extends LineData {
  tooltip?: string;
}

export interface MultiChartSeriesData {
  id: number | string;
  color?: string;
  data: ExtendedLineData[];
  lineWidth?: number;
  name: string;
  metricType?: string;
  metricName?: string;
}

export interface ChartOptions {
  background?: SolidColor;
  textColor?: string;
  height?: number;
  grid?: {
    vertLineColor?: string;
    horzLineColor?: string;
  };
  rightPriceScale?: {
    visible?: boolean;
    borderColor?: string;
    scaleMargins?: {
      top?: number;
      bottom?: number;
    };
  };
  leftPriceScale?: {
    visible?: boolean;
    borderColor?: string;
    scaleMargins?: {
      top?: number;
      bottom?: number;
    };
  };
  timeScale?: { borderColor: string };
  crosshairMode?: number;
}

interface MultiChartProps {
  headerFilterHeight?: number;
  isFullWidth?: boolean;
  chartData: MultiChartSeriesData[];
  volumeData?: ExtendedLineData[];
  chartOptions?: ChartOptions;
  panelProps?: IDockviewPanelProps;
  activeMetrics: (MetricCatalogItem | undefined)[];
  className?: string;
}

const MultiChart: React.FC<MultiChartProps> = ({
  headerFilterHeight = 0,
  isFullWidth = false,
  volumeData = [],
  chartData,
  chartOptions,
  panelProps,
  className,
  activeMetrics,
}) => {
  const legendRef = useRef<HTMLDivElement>(null);
  const { height: legendHeight } = useResizeObserver({ ref: legendRef });

  const [inactiveSeriesIds, setInactiveSeriesIds] = useState<
    (string | number)[]
  >([]);

  const [maxVisibleItems, setMaxVisibleItems] = useState(
    thresholds[0].maxItems
  );

  const contentOffset = headerFilterHeight + legendHeight;

  const activeMetricsData = useMemo(
    () =>
      activeMetrics.map((metric) => ({
        type: metric?.display_type,
        name: metric?.display_name,
      })),
    [activeMetrics]
  );

  const isSameMetric = useMemo(
    () =>
      activeMetricsData.length > 1 &&
      activeMetricsData.every(
        (metric) => metric.type === activeMetricsData[0].type
      ),
    [activeMetricsData]
  );

  const isDualAxis = activeMetricsData.length > 1;

  const filteredChartData = useMemo(
    () => chartData.filter((chart) => !inactiveSeriesIds.includes(chart.id)),
    [chartData, inactiveSeriesIds]
  );

  const filterActiveCharts = useCallback(
    (axisIndex: number) => {
      if (!filteredChartData.length) return [];
      return filteredChartData.filter(
        (chart) =>
          !isDualAxis ||
          (chart.metricType === activeMetricsData[axisIndex]?.type &&
            chart.metricName === activeMetricsData[axisIndex]?.name)
      );
    },
    [filteredChartData, isDualAxis, activeMetricsData]
  );

  const primaryAxisCharts = useMemo(
    () => (isSameMetric ? filteredChartData : filterActiveCharts(0)),
    [isSameMetric, filteredChartData, filterActiveCharts]
  );

  const secondaryAxisCharts = useMemo(
    () => (!isSameMetric && isDualAxis ? filterActiveCharts(1) : []),
    [isSameMetric, isDualAxis, filterActiveCharts]
  );

  const metricType = useMemo(
    () => activeMetricsData[0]?.type ?? "default",
    [activeMetricsData]
  );

  const shouldUseDashedStyle = useCallback(
    (chart: MultiChartSeriesData) =>
      isSameMetric && chart.metricName !== activeMetricsData[0]?.name,
    [isSameMetric, activeMetricsData]
  );

  const updateMaxVisibleItems = (width: number) => {
    const { maxItems } =
      thresholds.find((threshold) => width >= threshold.width) ||
      thresholds[thresholds.length - 1];
    setMaxVisibleItems(maxItems);
  };

  const { ref, chartRef, chartApi } = useChart({
    contentOffset,
    isFullWidth,
    chartOptions,
    panelProps,
    isLeftPriceScaleVisible: isDualAxis && secondaryAxisCharts.length > 0,
    updateMaxVisibleItems,
  });

  const toggleSeriesVisibility = (id: string | number) => {
    if (
      inactiveSeriesIds.length === chartData.length - 1 &&
      !inactiveSeriesIds.includes(id)
    ) {
      toast({
        title: "At least one series must remain active!",
        description: "",
        variant: "destructive",
      });
      return;
    }

    setInactiveSeriesIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((item) => item !== id)
        : [...prevIds, id]
    );
  };

  return (
    <div className={cn("flex flex-col bg-[#000000] h-full w-full", className)}>
      <Legend
        legendRef={legendRef}
        data={chartData}
        isDualAxis={isDualAxis}
        maxVisibleItems={maxVisibleItems}
        inactiveSeriesIds={inactiveSeriesIds}
        toggleSeriesVisibility={toggleSeriesVisibility}
      />
      <div className="relative size-full">
        <div ref={ref} className="absolute inset-0" />
      </div>
      {chartApi && (
        <ChartProvider value={{ chartApi, chartRef }}>
          {primaryAxisCharts.map((chart) => (
            <RightPriceScale
              key={chart.id}
              {...chart}
              volumeData={volumeData}
              panelProps={panelProps}
              contentOffset={contentOffset}
              shouldUseDashedStyle={shouldUseDashedStyle(chart)}
              metricType={chart.metricType ?? metricType}
              maxVisibleItems={maxVisibleItems}
            />
          ))}
          {secondaryAxisCharts.map((chart) => (
            <LeftPriceScale
              key={chart.id}
              {...chart}
              metricType={chart.metricType}
            />
          ))}
          <ChartTooltip />
        </ChartProvider>
      )}
    </div>
  );
};

export default MultiChart;
